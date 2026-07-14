const result = document.getElementById("result");

let scanner;
let busy = false;

async function startScanner() {

    result.innerHTML = "Membuka kamera...";

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

        result.innerHTML = "Arahkan QR ke kamera";

    }

    catch (err) {

        result.innerHTML = `
            <div class="error">
                <h3>Kamera gagal dibuka</h3>
                <p>${err}</p>
            </div>
        `;

    }

}

async function onScanSuccess(decodedText) {

    if (busy) return;

    busy = true;

    result.innerHTML = "Memproses...";

    try {

        const response = await fetch(CONFIG.apiUrl, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: decodedText
            })

        });

        const data = await response.json();

        showResult(data);

    }

    catch (err) {

        result.innerHTML = `
            <div class="error">
                <h2>Server Error</h2>
                <p>${err}</p>
            </div>
        `;

        busy = false;

    }

}

function showResult(data) {

    if (navigator.vibrate) {

        navigator.vibrate(200);

    }

    if (data.status == "SUCCESS") {

        result.innerHTML = `
            <div class="success">
                <h2>✅ BERHASIL</h2>
                <h3>${data.student.nama}</h3>
                <h3>${data.student.kelas}</h3>
                <p>${data.time}</p>
            </div>
        `;

    }

    else if (data.status == "ALREADY") {

        result.innerHTML = `
            <div class="warning">
                <h2>⚠ Sudah Dijemput</h2>
                <h3>${data.student.nama}</h3>
                <h3>${data.student.kelas}</h3>
            </div>
        `;

    }

    else {

        result.innerHTML = `
            <div class="error">
                <h2>❌ Data Tidak Ditemukan</h2>
            </div>
        `;

    }

    setTimeout(() => {

        busy = false;

        result.innerHTML = "Arahkan QR ke kamera";

    }, 2000);

}

startScanner();
