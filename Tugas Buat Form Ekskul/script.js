const formPendaftaran = document.getElementById('formPendaftaran');
const inputNama = document.getElementById('inputNama');
const inputJurusan = document.getElementById('inputJurusan');
const inputEkskul = document.getElementById('inputEkskul');
const tabelData = document.getElementById('dataPendaftaran');
const submitButton = document.getElementById('submitButton');
const cancelButton = document.getElementById('cancelButton');
const emptyState = document.getElementById('emptyState');
const STORAGE_KEY = 'pendaftaranEkskulLetris';
let daftarSiswa = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let indexEdit = null;

function simpanData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarSiswa));
}

function tampilkanData() {
    tabelData.innerHTML = '';
    daftarSiswa.forEach((siswa, index) => {
        const tr = document.createElement('tr');
        [index + 1, siswa.nama, siswa.kelas, siswa.jurusan, siswa.ekskul].forEach((nilai) => {
            const td = document.createElement('td');
            td.textContent = nilai;
            tr.appendChild(td);
        });
        const aksi = document.createElement('td');
        const edit = document.createElement('button');
        edit.type = 'button'; edit.className = 'editButton'; edit.textContent = 'Edit';
        edit.addEventListener('click', () => mulaiEdit(index));
        const hapus = document.createElement('button');
        hapus.type = 'button'; hapus.className = 'deleteButton'; hapus.textContent = 'Hapus';
        hapus.addEventListener('click', () => hapusData(index));
        aksi.append(edit, hapus);
        tr.appendChild(aksi);
        tabelData.appendChild(tr);
    });
    emptyState.hidden = daftarSiswa.length > 0;
}

function resetForm() {
    formPendaftaran.reset();
    indexEdit = null;
    submitButton.textContent = 'Tambah Data';
    cancelButton.hidden = true;
}

function mulaiEdit(index) {
    const siswa = daftarSiswa[index];
    inputNama.value = siswa.nama;
    document.querySelector(`input[name="kelas"][value="${siswa.kelas}"]`).checked = true;
    inputJurusan.value = siswa.jurusan;
    inputEkskul.value = siswa.ekskul;
    indexEdit = index;
    submitButton.textContent = 'Simpan Perubahan';
    cancelButton.hidden = false;
    document.querySelector('.formUtama').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hapusData(index) {
    if (!confirm(`Hapus data pendaftaran ${daftarSiswa[index].nama}?`)) return;
    daftarSiswa.splice(index, 1);
    simpanData();
    tampilkanData();
    if (indexEdit !== null) resetForm();
    alert('Data berhasil di hapus.');
}

formPendaftaran.addEventListener('submit', (event) => {
    event.preventDefault();
    const kelasDipilih = document.querySelector('input[name="kelas"]:checked');
    if (!inputNama.value.trim() || !kelasDipilih) {
        alert('Nama lengkap dan kelas wajib diisi.');
        return;
    }
    const siswa = {
        nama: inputNama.value.trim(),
        kelas: kelasDipilih.value,
        jurusan: inputJurusan.value,
        ekskul: inputEkskul.value
    };
    if (indexEdit === null) {
        daftarSiswa.push(siswa);
        simpanData();
        tampilkanData();
        resetForm();
        alert('Data berhasil ditambah.');
    } else {
        daftarSiswa[indexEdit] = siswa;
        simpanData();
        tampilkanData();
        resetForm();
        alert('Data berhasil di edit.');
    }
});

cancelButton.addEventListener('click', resetForm);
tampilkanData();