# Tutorial Installasi Project
Untuk menjalankan project, pastikan bun sudah terinstall di windows anda. caranya dengan menjalankan command berikut di terminal:

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

Jika sudah, cek apakah bun sudah benar-benar terinstall dengan cara jalankan command `bun -v`. Jika terminal mengembalikan versi bun yang anda pakai, itu tandanya anda telah menginstall bun dengan benar.
### Clone repository

```bash
git clone https://github.com/coderzhaxor/tempture_update.git
```


## Install Dependencies
Jalankan perintah berikut jika anda berada diluar folder `tempture_update` :
```bash
cd tempture_update; bun install; bun run setup
```

Namun apabila anda sudah berada di folder `tempture_update` maka cukup jalankan :
```bash
bun install; bun run setup
```
Tunggu Hingga proses install selesai, lalu anda bisa menjalankan project tersebut.
---

## Cara menjalankan
- Pastikan mysql sudah di aktifkan di xampp dengan database yang sudah tersedia dengan nama database `modbus`
- Dalam folder `tempture_update`, jalankan perintah :
```bash
bun run dev
```
