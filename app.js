const result = document.getElementById("result");

async function startCamera(){

    result.innerHTML="Membuka kamera...";

    try{

        const html5QrCode = new Html5Qrcode("reader");

        await html5QrCode.start(

            {
                facingMode:"environment"
            },

            {
                fps:10,
                qrbox:250
            },

            function(decodedText){

                result.innerHTML=`
                    <h2>QR Terbaca</h2>
                    <h3>${decodedText}</h3>
                `;

            }

        );

    }

    catch(err){

        console.error(err);

        result.innerHTML=`
            <div class="error">
                <h3>Kamera gagal dibuka</h3>
                <p>${err}</p>
            </div>
        `;

    }

}

startCamera();
