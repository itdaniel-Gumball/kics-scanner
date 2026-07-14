const result = document.getElementById("result");

let scanner;
let busy = false;

async function startScanner() {

    result.innerHTML = "📷 Membuka kamera...";

    scanner = new Html5Qrcode("reader");

    try {

        await scanner.start(
            {
                facingMode: "environment"
            },
            {
                fps: 10,
                qrbox: 250
            },
            onScanSuccess
        );

        result.innerHTML = "✅ Arahkan QR ke kamera";

    } catch (err) {

        console.error(err);

        result.innerHTML = `
            <div class="error">
                <h2>❌ Kamera Gagal</h2>
                <p>${err.message || err}</p>
            </div>
        `;

    }

}

async function onScanSuccess(decodedText) {

    if (busy) return;

    busy = true;

    result.innerHTML = "<h2>⏳ Memproses...</h2>";

    try {

        console.log("QR:", decodedText);
        console.log("API:", CONFIG.apiUrl);

        const response = await fetch(CONFIG.apiUrl, {

            method: "POST",

            redirect: "follow",

            headers: {
                "Content-Type": "text/plain;charset=UTF-8"
            },

            body: JSON.stringify({
                id: decodedText
            })

        });

        console.log("Status:", response.status);

        const text = await response.text();

        console.log("Response:", text);

        const data = JSON.parse(text);

        showResult(data);

    }
    catch (err) {

        console.error(err);

        result.innerHTML = `
            <div class="error">
                <h2>❌ Server Error</h2>
                <p>${err.message}</p>
            </div>
        `;

        busy = false;

    }

}

function showResult(data) {

    if (navigator.vibrate) {
        navigator.vibrate(150);
    }

    if (data.status === "SUCCESS") {

        result.innerHTML = `
            <div class="success">
                <h2>✅ BERHASIL</h2>
                <h3>${data.student.nama}</h3>
                <h3>${data.student.kelas}</h3>
                <h3>${data.time}</h3>
            </div>
        `;

    }
    else if (data.status === "ALREADY") {

        result.innerHTML = `
            <div class="warning">
                <h2>⚠ Sudah Dijemput</h2>
                <h3>${data.student.nama}</h3>
                <h3>${data.student.kelas}</h3>
            </div>
        `;

    }
    else if (data.status === "NOT_FOUND") {

        result.innerHTML = `
            <div class="error">
                <h2>❌ Data Tidak Ditemukan</h2>
            </div>
        `;

    }
    else {

        result.innerHTML = `
            <div class="error">
                <h2>❌ ${data.message}</h2>
            </div>
        `;

    }

    setTimeout(() => {

        busy = false;

        result.innerHTML = "✅ Arahkan QR ke kamera";

    }, 2000);

}

startScanner();
