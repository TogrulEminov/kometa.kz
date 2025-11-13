## **Mühit Dəyişənləri (Environment Variables)**

Tətbiqin düzgün işləməsi üçün proyektin ana qovluğunda `.env` adlı bir fayl yaradılmalı və aşağıdakı dəyişənlər təyin edilməlidir. Bu dəyişənlər məxfi məlumatları və xarici servislərin konfiqurasiyasını ehtiva edir.

| Dəyişən (Variable)     | Açıqlama                                                                        | Nümunə Dəyər                                                 |
| ---------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`         | Verilənlər bazasına qoşulmaq üçün tam URL (Prisma tərəfindən istifadə olunur).  | `postgresql://user:password@host:5432/db_name?schema=public` |
|                        |                                                                                 |                                                              |
| `SMTP_HOST`            | E-poçt göndərmək üçün SMTP serverinin hostu.                                    | `smtp.example.com`                                           |
| `SMTP_PORT`            | SMTP serverinin portu (adətən 587 və ya 465).                                   | `587`                                                        |
| `SMTP_USER`            | SMTP serverinə qoşulmaq üçün istifadəçi adı.                                    | `user@example.com`                                           |
| `SMTP_PASSWORD`        | SMTP serveri üçün şifrə və ya tətbiqə özəl parol.                               | `your-smtp-password`                                         |
| `SMTP_FROM`            | E-poçtların hansı ünvandan göndəriləcəyi.                                       | `"Your App Name" <no-reply@example.com>`                     |
|                        |                                                                                 |                                                              |
| `CF_ACCESS_KEY_ID`     | Cloudflare R2 yaddaş sahəsinə qoşulmaq üçün Access Key ID.                      | `your-cf-access-key-id`                                      |
| `CF_SECRET_ACCESS_KEY` | Cloudflare R2 üçün Secret Access Key.                                           | `your-cf-secret-access-key`                                  |
| `CF_PUBLIC_ACCESS_URL` | R2 bucket-dəki fayllara public giriş üçün URL.                                  | `https://pub-....r2.dev`                                     |
| `CF_BUCKET`            | Cloudflare R2 bucket-in adı.                                                    | `your-bucket-name`                                           |
| `CF_ENDPOINT`          | Cloudflare R2 API endpoint-i.                                                   | `https://....cloudflarestorage.com`                          |
|                        |                                                                                 |                                                              |
| `CLOUD_GOOGLE_API_KEY` | Google Cloud servisləri (məsələn, Maps, Translate) üçün API açarı.              | `your-google-api-key`                                        |
| `NEXTAUTH_SECRET`      | İstifadəçi sessiyalarını təsdiqləmək üçün istifadə olunan JWT üçün məxfi açar.  | `a-very-strong-and-secret-random-string`                     |
| `FRONTEND_HOST`        | Tətbiqin frontend hissəsinin URL-i (CORS, yönləndirmələr üçün istifadə olunur). | `https://yourdomain.com`                                     |
