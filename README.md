# MasaKuy: Memasak dari sisa jadi rasa

## Tim CC25 - CF036

| ID | Nama       | Learning Path              |
|----|------------------|----------------------|
| MC001D5X1234 | Sindi Aprilianti   | Machine Learning|
| MC001D5X1126 | Viby Ladyscha Yalasena Winarno| Machine Learning|
| MC001D5Y1303 | I Gusti Ngurah Sucahya Satria Adi Pratama  | Machine Learning|
| FC001D5X2367 |  Dwiamalina Qurratuain Najla | Front-end & Back-End|
| FC001D5X1428 |  Syifa Izzatul Rahmah | Front-end & Back-End|


## Latar Belakang

Indonesia termasuk salah satu negara dengan tingkat food waste tertinggi di dunia, dan salah satu penyumbang utamanya berasal dari rumah tangga. Banyak orang, termasuk mahasiswa kos sering kesulitan memanfaatkan bahan makanan sisa karena kurangnya ide resep, sehingga bahan tersebut terbuang percuma. Proyek ini bertujuan menjawab pertanyaan “Bagaimana kesesuaian antara bahan makanan sisa yang dimiliki pengguna dengan resep yang dihasilkan dapat membantu mengolah bahan tersebut guna mengurangi pemborosan?”. Untuk itu, kami mengembangkan MasaKuy, sebuah website yang merekomendasikan resep masakan berdasarkan bahan makanan sisa yang dimasukkan pengguna. Proyek ini dirancang untuk membantu pengguna, terutama mahasiswa agar dapat memanfaatkan bahan yang tersedia dengan optimal, sekaligus mengurangi pemborosan makanan. 

## Model Machine Learning
### Data Understanding
#### Sumber Data
Dataset diambil dari data resep pada website [Resep Masakan] (https://cookpad.com/) dengan metode scraping. Dataset terdiri dari 4 informasi, yaitu url resep, nama makanan, bahan, dan langkah-langkah pembuatan. 

- Jumlah baris: 32465 
- Jumlah kolom: 4

| Nama Variabel          | Deskripsi                                                                 |
|------------------------|---------------------------------------------------------------------------|
| `url`                | Tautan setiap resep yang didapat |
| `nama_makanan`| Judul resep. |
| `bahan`               | Rincian bahan-bahan yang digunakan untuk memasak                                        |
| `langkah`               | Urutan proses memasak    |

### Data Preparation
Tahap data preparation bertujuan untuk membersihkan dan menyederhanakan dataset agar siap digunakan dalam proses pembuatan sistem rekomendasi resep masakan. Tahapan yang dilakukan dalam proyek ini sebagai berikut:
#### 1. Cleaning Text
Fungsi ini bertujuan untuk memastikan data bersih dari elemen yang tidak penting seperti URL, tag HTML, dan karakter asing sebelum digunakan oleh model.
#### 2. Menyusun Langkah Memasak 
Fungsi ini akan menyusun ulang langkah memasak menjadi poin-poin yang terstruktur dan diberi penomoran otomatis. 
```
Contoh hasil penomoran
 1. tumis bawang putih hingga harum.
 2. masukkan ayam dan masak hingga matang.
```
#### 3. Mendeteksi Bahasa Indonesia
Fungsi ini memastikan bahwa hanya resep berbahasa Indonesia yang digunakan dalam pelatihan, dengan mendeteksi bahasa dari kombinasi kolom bahan, langkah, dan nama_makanan.
#### 4. Memformat Text Target
Dalam pelatihan, format target akan sebagai berikut:
```
Contoh:
[TITLE] tempe goreng tepung
[STEP]
 1. iris daun bawang bawang merah.
 2. campurkan tepung kobe dengan air secara perlahan aduk aduk hingga merata.
 3. tambahkan daun bawang bawang merah kaldu jamur ketumbar aduk aduk hingga merata.
 4. tambahkan tempe aduk aduk hingga tercampur merata.
 5. lalu marinasi.
 6. menit semalaman dikulkas.
 7. panaskan minyak goreng tempe hingga kecoklatan.
 8. voila tempe goreng tepung siap disantap.
```
> Terdapat keyword [TITLE] dan [STEP] sebagai penanda untuk mempermudah proses parsing. Lalu sebenarnya "enter" yang terdapat pada contoh dalam dataset aslinya menggunakan "\n".
#### 5. Filtering dan Labelling untuk Nama Masakan yang Mirip
Menggunakan TF-IDF berbasis karakter n-gram (panjang 3–5 karakter). Lalu, menghitung kemiripan antar label menggunakan cosine similarity. Semua label yang sangat mirip (kemiripan ≥ 0.9) akan diwakili oleh satu label umum. Jika dua nama makanan berbeda hanya sedikit misalnya typo atau variasi kecil akan dianggap sama. Hal ini untuk mengatasi ribuan nama makanan yang bisa jadi mirip-mirip, typo, atau bentuknya tidak konsisten.

### Modelling 

#### Model Summary
```
Model: "functional"
_________________________________________________________________
Layer (type)--------------------Output Shape---------Param #    
=================================================================
input_layer (InputLayer)--------(None, 1)------------0           
text_vectorization--------------(None, 150)----------0           
embedding (Embedding)-----------(None, 150, 128)-----488064      
not_equal (NotEqual)------------(None, 150)----------0           
bidirectional (Bidirectional)---(None, 128)----------98816       
dropout (Dropout)---------------(None, 128)----------0           
dense (Dense)-------------------(None, 64)-----------8256        
batch_normalization-------------(None, 64)-----------256         
dropout_1 (Dropout)-------------(None, 64)-----------0           
dense_1 (Dense)-----------------(None, 64)-----------4160        
dropout_2 (Dropout)-------------(None, 64)-----------0           
dense_2 (Dense)-----------------(None, 154)----------10010       
=================================================================
Total params: 609,562 (2.33 MB)
Trainable params: 609,434 (2.32 MB)
Non-trainable params: 128 (512.00 B)
_________________________________________________________________
```
#### Evaluasi Model
![model_result](images/model_result.png)
</br>
### Controlled Overfitting
1. Fitur pencarian resep dirancang untuk menemukan makanan spesifik yang cocok dengan kombinasi bahan yang spesifik juga. Misalnya input pengguna ``ayam, kemangi``. Maka, output yang diharapkan muncul salah satunya ``ayam suwir kemangi pedas``. </br>
**Contoh Input**</br>
![contoh_input](images/input.png)</br>
**Contoh Output**</br>
![contoh_input](images/output.png)<br>

2. Model tidak hanya memberikan 1 hasil, tapi beberapa resep terbaik sehingga membuat overfitting lebih aman karena hasil masih relevan.
3. Generalisasi yang terlalu tinggi membuat prediksi menjadi tidak relevan karena kombinasi bahan untuk makanan tertentu sudah sangat spesifik. 

## API Docs
### Endpoint: ``/predict``

### Request Body:
```
{
  "bahan_input": "string"
}
```
### Responses
> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `OK`                                |
> | `422`         | `application/json`                | `{"detail":[{"loc":["string",0],"msg":"string","type":"string"}]}`                            |
                                                               

## Interface Website
![image](https://github.com/user-attachments/assets/be0363f1-7ba1-44f3-b20d-641766ac9ca1)

![image](https://github.com/user-attachments/assets/e7f981e5-7c16-4b1b-90fc-2e8521cb2eca)

![image](https://github.com/user-attachments/assets/0d42a27b-dd09-44e0-a239-1eb93118dd74)

![image](https://github.com/user-attachments/assets/003fd978-fa97-4a59-8925-fe68888b25af)

![image](https://github.com/user-attachments/assets/bd285991-4a87-4b95-8dfa-85bd30fffe09)

![image](https://github.com/user-attachments/assets/020d7d2c-1559-4435-8465-1434ff089595)

![image](https://github.com/user-attachments/assets/2a8335f2-c213-488c-837e-b99af2860fc8)

![image](https://github.com/user-attachments/assets/fd7694d2-6d14-4a40-8b8a-63ad5d9a956c)









