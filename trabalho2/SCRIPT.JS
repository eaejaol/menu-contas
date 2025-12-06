// -------------------- VARIÁVEIS GLOBAIS --------------------
const configPadrao = {
    corFundo: "#f5f5f7",
    fonte: "'Montserrat', Arial, sans-serif",
    tamanhoFonte: "16px",
    logoSistema: "",
    nomeSistema: "Nome do Sistema"
};

let logoDataUrl = ""; // Armazena a imagem da logo em base64
window.configuracoesGlobais = {}; // Configuração ativa do sistema
const STORAGE_KEY = 'configuracoesContasPagar'; // Chave do localStorage

// -------------------- FUNÇÕES DE CONFIGURAÇÃO --------------------
function salvarConfiguracoes(config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.configuracoesGlobais = config;
}

function carregarConfiguracoes() {
    const config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || configPadrao;
    window.configuracoesGlobais = config;

    // Aplicar cores e fontes
    document.body.style.backgroundColor = config.corFundo;
    document.querySelector('.main-content').style.backgroundColor = config.corFundo;
    const elementos = document.querySelectorAll('body, .main-content, h2#nome-sistema, input, select, button, .sidebar');
    elementos.forEach(el => {
        el.style.fontFamily = config.fonte;
        el.style.fontSize = config.tamanhoFonte;
    });

    // Nome do sistema
    document.getElementById('nome-sistema').textContent = config.nomeSistema;
    document.getElementById('nomeSistemaInput').value = config.nomeSistema;

    // Selects
    document.getElementById('corFundo').value = config.corFundo;
    document.getElementById('fonteSistema').value = config.fonte;
    document.getElementById('fonteTamanho').value = config.tamanhoFonte;

    // Logo
    const logoEl = document.getElementById('logo-fixed');
    if (config.logoSistema) {
        logoEl.src = config.logoSistema;
        logoEl.style.display = "inline-block";
        document.getElementById('logoPreview').src = config.logoSistema;
    } else {
        logoEl.style.display = "none";
        document.getElementById('logoPreview').src = "";
    }
}

// -------------------- EVENTOS DE INTERFACE --------------------
document.querySelectorAll('.sidebar-menu li').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.sidebar-menu li').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
        this.classList.add('active');
        document.getElementById('tab-' + this.dataset.tab).style.display = 'block';
    });
});

// -------------------- EVENTOS DE SALVAMENTO --------------------
document.getElementById('btnSalvarCor').addEventListener('click', () => {
    const config = window.configuracoesGlobais;
    config.corFundo = document.getElementById('corFundo').value;
    salvarConfiguracoes(config);
    carregarConfiguracoes();
    alert('Cor de fundo salva!');
});

document.getElementById('btnSalvarFonte').addEventListener('click', () => {
    const config = window.configuracoesGlobais;
    config.fonte = document.getElementById('fonteSistema').value;
    config.tamanhoFonte = document.getElementById('fonteTamanho').value;
    salvarConfiguracoes(config);
    carregarConfiguracoes();
    alert('Fonte salva!');
});

document.getElementById('btnSalvarNome').addEventListener('click', () => {
    const config = window.configuracoesGlobais;
    config.nomeSistema = document.getElementById('nomeSistemaInput').value || 'Nome do Sistema';
    salvarConfiguracoes(config);
    carregarConfiguracoes();
    alert('Nome salvo!');
});

document.getElementById('logoSistema').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
        logoDataUrl = evt.target.result;
        document.getElementById('logoPreview').src = logoDataUrl;
    };
    reader.readAsDataURL(file);
});

document.getElementById('btnSalvarLogo').addEventListener('click', () => {
    if (!logoDataUrl) { alert('Selecione uma imagem antes de salvar!'); return; }
    const config = window.configuracoesGlobais;
    config.logoSistema = logoDataUrl;
    salvarConfiguracoes(config);
    carregarConfiguracoes();
    alert('Logo salva!');
});

document.getElementById('btnRemoverLogo').addEventListener('click', () => {
    const config = window.configuracoesGlobais;
    config.logoSistema = "";
    logoDataUrl = "";
    salvarConfiguracoes(config);
    carregarConfiguracoes();
    alert('Logo removida!');
});

// -------------------- RELATÓRIOS --------------------
function baixarArquivo(conteudo, nomeArquivo, tipo) {
    const blob = new Blob([conteudo], { type: tipo });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById('btnEmitirRelatorioTxt').addEventListener('click', () => {
    const config = window.configuracoesGlobais;
    let txt = "";
    for (const key in config) txt += `${key}: ${config[key]}\n`;
    baixarArquivo(txt, 'relatorio-configuracoes.txt', 'text/plain');
});

document.getElementById('btnEmitirRelatorioXml').addEventListener('click', () => {
    const config = window.configuracoesGlobais;
    let xml = '<?xml version="1.0" encoding="UTF-8"?><configuracoes>';
    for (const key in config) xml += `<${key}>${config[key]}</${key}>`;
    xml += '</configuracoes>';
    baixarArquivo(xml, 'relatorio-configuracoes.xml', 'application/xml');
});

// -------------------- INICIALIZAÇÃO --------------------
window.addEventListener('DOMContentLoaded', carregarConfiguracoes);