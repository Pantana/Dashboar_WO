/**
 * ==========================================================================
 * GOOGLE APPS SCRIPT - DASHBOARD PIVOT PROGRESS WO
 * Salin dan Tempel kode ini di menu Ekstensi > Apps Script pada Google Sheets Anda.
 * ==========================================================================
 */

// Nama sheet target. Silakan sesuaikan jika nama sheet Anda bukan "Sheet1"
const NAMA_SHEET = "Sheet1"; 

/**
 * Menangani Request GET dari Browser
 * Apps Script menggunakan doGet untuk membaca data dan melakukan update aman dari CORS.
 */
function doGet(e) {
  // Menghindari error CORS dengan mengembalikan header yang tepat
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const action = e.parameter.action;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NAMA_SHEET) 
                  || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
                  
    if (!sheet) {
      throw new Error("Sheet tidak ditemukan. Periksa nama sheet Anda.");
    }
    
    // TENTUKAN AKSI BERDASARKAN PARAMETER 'action'
    if (action === "read") {
      // 1. MEMBACA DATA DARI SPREADSHEET
      const data = readSheetData(sheet);
      return output.setContent(JSON.stringify({
        status: "success",
        data: data
      }));
      
    } else if (action === "update") {
      // 2. MEMPERBARUI STATUS, TEKNISI, ATAU GROUPING
      const wonum = e.parameter.wonum;
      const status = e.parameter.status;
      const teknisi = e.parameter.teknisi;
      const grouping = e.parameter.grouping;
      
      if (!wonum) {
        throw new Error("Parameter 'wonum' wajib diisi untuk melakukan update.");
      }
      
      const result = updateSheetRow(sheet, wonum, status, teknisi, grouping);
      return output.setContent(JSON.stringify({
        status: "success",
        message: "Berhasil memperbarui data.",
        details: result
      }));
      
    } else {
      // Aksi tidak dikenal
      return output.setContent(JSON.stringify({
        status: "error",
        message: "Aksi tidak dikenal. Gunakan action=read atau action=update"
      }));
    }
    
  } catch (error) {
    // Tangani error dan kirimkan respons error ke browser
    return output.setContent(JSON.stringify({
      status: "error",
      message: error.toString()
    }));
  }
}

/**
 * Fungsi Membaca Seluruh Baris Sheet & Memetakan ke format JSON
 */
function readSheetData(sheet) {
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  if (values.length < 2) {
    return []; // Sheet kosong (hanya ada header atau tidak sama sekali)
  }
  
  const headers = values[0].map(h => h.toString().trim());
  const listData = [];
  
  // Deteksi nomor indeks kolom berdasarkan header untuk keandalan tinggi
  const colIndices = {
    wonum: headers.indexOf("WONUM"),
    datel: headers.indexOf("DATEL"),
    sto: headers.indexOf("STO"),
    ao: headers.indexOf("AO"),
    paket: headers.indexOf("PAKET"),
    alpro: headers.indexOf("ALPRO"),
    inet: headers.indexOf("INET NUMBER"),
    custName: headers.indexOf("CUST NAME"),
    kontak: headers.indexOf("KONTAK"),
    alamat: headers.indexOf("ALAMAT"),
    sektor: headers.indexOf("Sektor"),
    grouping: headers.indexOf("Grouping"),
    status: headers.indexOf("STATUS"),
    teknisi: headers.indexOf("Teknisi"),
    keterangan: headers.indexOf("KETERANGAN")
  };
  
  // Loop setiap baris data (mulai dari baris ke-2 / indeks 1)
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    
    // Jika kolom WONUM kosong, lewati baris ini
    if (!row[colIndices.wonum] || row[colIndices.wonum].toString().trim() === "") {
      continue;
    }
    
    // Konversi baris ke bentuk objek JavaScript terstruktur
    const taskObj = {
      WONUM: row[colIndices.wonum] ? row[colIndices.wonum].toString().trim() : "",
      DATEL: colIndices.datel !== -1 ? row[colIndices.datel].toString().trim() : "",
      STO: colIndices.sto !== -1 ? row[colIndices.sto].toString().trim() : "",
      AO: colIndices.ao !== -1 ? row[colIndices.ao].toString().trim() : "",
      PAKET: colIndices.paket !== -1 ? row[colIndices.paket].toString().trim() : "",
      ALPRO: colIndices.alpro !== -1 ? row[colIndices.alpro].toString().trim() : "",
      INET_NUMBER: colIndices.inet !== -1 ? row[colIndices.inet].toString().trim() : "",
      CUST_NAME: colIndices.custName !== -1 ? row[colIndices.custName].toString().trim() : "",
      KONTAK: colIndices.kontak !== -1 ? row[colIndices.kontak].toString().trim() : "",
      ALAMAT: colIndices.alamat !== -1 ? row[colIndices.alamat].toString().trim() : "",
      Sektor: colIndices.sektor !== -1 ? row[colIndices.sektor].toString().trim() : "",
      Grouping: colIndices.grouping !== -1 ? row[colIndices.grouping].toString().trim() : "",
      STATUS: colIndices.status !== -1 ? row[colIndices.status].toString().trim() : "",
      Teknisi: colIndices.teknisi !== -1 ? row[colIndices.teknisi].toString().trim() : "",
      KETERANGAN: colIndices.keterangan !== -1 ? row[colIndices.keterangan].toString().trim() : ""
    };
    
    listData.push(taskObj);
  }
  
  return listData;
}

/**
 * Fungsi Mencari Baris Berdasarkan WONUM dan Memperbarui Kolom STATUS & Teknisi
 */
function updateSheetRow(sheet, wonum, status, teknisi, grouping) {
  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0].map(h => h.toString().trim());
  
  const wonumColIndex = headers.indexOf("WONUM");
  const statusColIndex = headers.indexOf("STATUS");
  const teknisiColIndex = headers.indexOf("Teknisi");
  const groupingColIndex = headers.indexOf("Grouping");
  
  if (wonumColIndex === -1) throw new Error("Kolom 'WONUM' tidak ditemukan di spreadsheet.");
  if (statusColIndex === -1) throw new Error("Kolom 'STATUS' tidak ditemukan di spreadsheet.");
  if (teknisiColIndex === -1) throw new Error("Kolom 'Teknisi' tidak ditemukan di spreadsheet.");
  
  let targetRowIndex = -1;
  
  // Cari baris yang memiliki WONUM sesuai
  for (let i = 1; i < values.length; i++) {
    if (values[i][wonumColIndex] && values[i][wonumColIndex].toString().trim() === wonum) {
      targetRowIndex = i + 1; // Konversi ke baris 1-indexed di Google Sheet
      break;
    }
  }
  
  if (targetRowIndex === -1) {
    throw new Error(`Data dengan WONUM ${wonum} tidak ditemukan.`);
  }
  
  // Lakukan pembaruan pada sel yang bersangkutan
  if (status !== undefined) {
    sheet.getRange(targetRowIndex, statusColIndex + 1).setValue(status);
  }
  if (teknisi !== undefined) {
    sheet.getRange(targetRowIndex, teknisiColIndex + 1).setValue(teknisi);
  }
  if (grouping !== undefined && groupingColIndex !== -1) {
    sheet.getRange(targetRowIndex, groupingColIndex + 1).setValue(grouping);
  }
  
  return {
    wonum: wonum,
    rowUpdated: targetRowIndex,
    updatedFields: {
      status: status,
      teknisi: teknisi,
      grouping: grouping
    }
  };
}
