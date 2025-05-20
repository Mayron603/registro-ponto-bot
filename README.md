# 🚔 BatePontoBot - Sistema de Registro Policial

> Bot de Discord para controle de plantões com integração web

## 📌 Funcionalidades

- ✅ Registro de entrada/saída via botões  
- 📊 Painel de agentes em serviço em tempo real  
- 📈 Relatório completo de horas trabalhadas  
- 🌐 Painel web administrativo (desenvolvimento)  

## 🛠 Tecnologias

- **Backend**: Node.js + Express  
- **Database**: MongoDB  
- **Frontend**: (opcional)  
- **Bibliotecas**:  
  - Discord.js  

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Mayron603/registro-ponto-bot.git
cd BatePontoBot-Discord
```

2. Instale as dependências:
```bash
npm install
```

3. Configure suas variáveis de ambiente criando um arquivo `.env` com o conteúdo:
```
TOKEN=seu_token_do_bot
CLIENT_ID=
GUILD_ID=
MONGODB_URI=sua_conexao_mongodb
```

## 🌐 Acessando o Painel de Controle
Após executar o bot, o painel web administrativo pode ser acessado via o link:
```
http://localhost:3000/
```

## 🚀 Como Executar

| Comando         | Descrição                         |
|-----------------|----------------------------------|
| `npm run dev`   | Modo desenvolvimento (tudo junto) |

## 📋 Comandos Principais

| Comando          | Ação                        | Permissão      |
|------------------|-----------------------------|----------------|
| `/painelpolicia` | Cria o painel de registro    | Administradores|
| `/horas @user`   | Mostra relatório completo    | Todos         |

## 📸 Preview

### Painel Discord  
Painel de controle no Discord

## 📝 Estrutura de Arquivos

```
📦 BatePontoBot-Discord
├── 📂 commands
│   ├── apagar.js
│   ├── horas.js
│   ├── painel.js
│   ├── relatorio_excel.js
├── 📂 models
│   └── Registro.js
├── 📂 public
│   └── index.html
├── 📂 relatorios
├── 📂 utils
│   └── logger.js
├── 📜 .env
├── 📜 api.js
├── 📜 database.js
├── 📜 deploy-commands.js
├── 📜 index.js
├── 📜 package-lock.json
├── 📜 package.json
└── 📜 registroponto.js

```

## 🤝 Contribuição

1. Faça um fork do projeto  
2. Crie uma branch (ex: `git checkout -b feature/nova-feature`)  
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)  
4. Push para a branch (`git push origin feature/nova-feature`)  
5. Abra um Pull Request  

## 📜 Licença

MIT © Mayron

---

⚠️ **Importante:** Configure as permissões do bot no Discord Developer Portal para:  
- `applications.commands`  
- `bot` (com as intenções necessárias)  
