// Configuração do PDF.js
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

// Função para manipular o upload do PDF e exibir com a marca d'água
async function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecione um documento PDF.");
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function() {
        const typedArray = new Uint8Array(this.result);
        renderPDFWithWatermark(typedArray);
    };
    fileReader.readAsArrayBuffer(file);
}

// Função para renderizar o PDF com a marca d'água
async function renderPDFWithWatermark(pdfData) {
    const canvas = document.getElementById('pdfCanvas');
    const context = canvas.getContext('2d');

    // Carrega o PDF
    const pdf = await pdfjsLib.getDocument(pdfData).promise;
    const page = await pdf.getPage(1);

    // Define o tamanho do canvas com base no PDF
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Renderiza a página do PDF
    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    await page.render(renderContext).promise;

    // Configura e desenha a marca d'água
    const watermarkText = `Documento contendo dados pessoais acessado no sistema PASS/MPRO em ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()} pela matrícula 44044 - Requerimento nº 1234`;
    context.globalAlpha = 0.2;  // Define a opacidade da marca d'água
    context.font = "30px Arial";
    context.fillStyle = "red";
    context.textAlign = "center";
    context.rotate(-Math.PI / 4); // Rotaciona o texto para um efeito de marca d'água diagonal
    context.fillText(watermarkText, canvas.width / 2, canvas.height / 2);
}
