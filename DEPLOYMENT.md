# نشر التطبيق على Render

## المتطلبات

- حساب على Render (https://render.com)
- GitHub Token
- Render API Key

## خطوات النشر

### 1. إنشاء قاعدة البيانات على Render

1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. اختر **New** → **PostgreSQL**
3. أدخل التفاصيل التالية:
   - **Name**: `manus-agent-db`
   - **Database**: `manus_agent_db`
   - **User**: `manus_user`
   - **Region**: اختر المنطقة الأقرب لك
   - **Plan**: اختر الخطة المناسبة

4. انسخ **Internal Database URL** (ستحتاجها لاحقاً)

### 2. إنشاء Web Service على Render

1. في Render Dashboard، اختر **New** → **Web Service**
2. اختر **Connect a repository** وربط مستودع GitHub
3. أدخل التفاصيل التالية:
   - **Name**: `manus-agent-app`
   - **Region**: نفس منطقة قاعدة البيانات
   - **Branch**: `main`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Plan**: اختر الخطة المناسبة

### 3. إضافة المتغيرات البيئية

في إعدادات Web Service، أضف المتغيرات البيئية التالية:

```
NODE_ENV=production
DATABASE_URL=<Internal Database URL من الخطوة 1>
MANUS_PASSWORD=<كلمة المرور الآمنة>
DEEPSEEK_API_TOKEN=<توكن DeepSeek API>
JWT_SECRET=<مفتاح سري عشوائي>
```

### 4. تطبيق الهجرات على قاعدة البيانات

بعد نشر التطبيق، قم بتشغيل الأوامر التالية:

```bash
# في Render Shell
pnpm db:push
```

## التحقق من النشر

1. انتظر حتى يكتمل البناء والنشر
2. اذهب إلى رابط التطبيق المعطى من Render
3. أدخل كلمة المرور المحددة في `MANUS_PASSWORD`
4. تحقق من أن التطبيق يعمل بشكل صحيح

## استكشاف الأخطاء

إذا واجهت مشاكل:

1. تحقق من السجلات في Render Dashboard
2. تأكد من أن جميع المتغيرات البيئية مضبوطة بشكل صحيح
3. تأكد من أن قاعدة البيانات متصلة بشكل صحيح

## الروابط المهمة

- **Render Dashboard**: https://dashboard.render.com
- **GitHub Repository**: https://github.com/melsofany/AISoftwareFactory
- **DeepSeek API**: https://api.deepseek.com
