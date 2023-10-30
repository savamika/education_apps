export const color = {
    primery: '#2D68FF',
    primery2: '#12A3F6',
    primery3: '#E1F3F3',
    gold: '#DAAA00',
    abuabu: '#E6E6E6',
    disabled: '#939393',
    link: '#007DF1',
    black: '#4D4D4D',
    white: 'white',
    red: '#FF3434',
    green: '#0bbf58',
    yellow: '#e0e01f',
    yellow2: '#FFD80C'
}

export function formatRupiah(angka, prefix) {
    if (angka == '' || angka == 'null') {
        return 'Rp. 0';
    }
    try {
        var number_string = angka.toString().replace(/[^,\d]/g, ''),
            split = number_string.split(','),
            sisa = split[0].length % 3,
            rupiah = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        // tambahkan titik jika yang di input sudah menjadi angka ribuan
        if (ribuan) {
            separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
        return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
    } catch (error) {
        console.log('error', error)
        return 'Rp. 0';
    }

}

export function number_of_day(hari) {

    if (hari == 'MINGGU') {
        return 0;
    } else if (hari == 'SENIN') {
        return 1;
    } else if (hari == 'SELASA') {
        return 2;
    } else if (hari == 'RABU') {
        return 3;
    } else if (hari == 'KAMIS') {
        return 4;
    } else if (hari == 'JUMAT') {
        return 5;
    } else if (hari == 'SABTU') {
        return 6;
    }

}

export function beauty_date(tgl) {
    if (tgl == '') {
        return false
    }
    let new_date = new Date(tgl);
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    let tanggal = new_date.getDate()
    if (tanggal < 10) {
        tanggal = '0' + tanggal.toString()
    }
    let bulan = months[new_date.getMonth()];

    let beauty = tanggal.toString() + ' ' + bulan + ' ' + new_date.getFullYear().toString()

    return beauty;
}