// generateFakeImage.js - Versão que gera SVG (sem dependências externas)
import path from 'path';
import fs from 'fs';

export async function generateFakeImage(userName, fileName) {
  try {
    // Cores para o fundo dos avatares
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
      '#F1948A', '#85929E', '#F39C12', '#8E44AD'
    ];
    
    // Seleciona cor baseada no nome (sempre a mesma cor para o mesmo nome)
    const colorIndex = userName.length % colors.length;
    const backgroundColor = colors[colorIndex];
    
    // Pega as iniciais do nome
    const initials = userName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();

    // Cria o SVG como string
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="${backgroundColor}" rx="8" ry="8"/>
  <text x="64" y="64" 
        font-family="Arial, sans-serif" 
        font-size="36" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="central">${initials}</text>
</svg>`;

    // Cria diretório se não existir
    const uploadDir = path.resolve('uploads/fake');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Troca extensão para .svg
    const svgFileName = fileName.replace('.png', '.svg');
    const fullPath = path.join(uploadDir, svgFileName);
    
    // Salva o arquivo SVG
    fs.writeFileSync(fullPath, svgContent, 'utf8');

    console.log(`✅ Avatar SVG gerado: ${svgFileName} (${initials}) - ${backgroundColor}`);
    
    // Retorna o caminho relativo
    return `/uploads/fake/${svgFileName}`;
    
  } catch (error) {
    console.error('❌ Erro ao gerar avatar SVG:', error.message);
    return null;
  }
}