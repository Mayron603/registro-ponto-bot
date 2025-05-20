# 🚔 BatePontoBot - Sistema de Registro Policial

![Banner]()

> Bot de Discord para controle de plantões com integração web

## 📌 Funcionalidades

- ✅ Registro de entrada/saída via botões  
- 📊 Painel de agentes em serviço em tempo real  
- 📈 Relatório completo de horas trabalhadas  
- 🔒 Prevenção contra registros duplicados  
- 🌐 Painel web administrativo (opcional)  

## 🛠 Tecnologias

- **Backend**: Node.js + Express  
- **Database**: MongoDB  
- **Frontend**: (opcional)  
- **Bibliotecas**:  
  - Discord.js  
  - Mongoose  
  - Moment.js  

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/BatePontoBot-Discord.git
cd BatePontoBot-Discord
```

2. Instale as dependências:
```bash
npm install
```

3. Configure suas variáveis de ambiente criando um arquivo `.env` com o conteúdo:
```
TOKEN=seu_token_do_bot
MONGODB_URI=sua_conexao_mongodb
PORT=3000
```

## 🚀 Como Executar

| Comando         | Descrição                         |
|-----------------|----------------------------------|
| `npm start`     | Inicia apenas o bot Discord       |
| `npm run api`   | Inicia a API de dados             |
| `npm run client`| Inicia o painel web (opcional)    |
| `npm run dev`   | Modo desenvolvimento (tudo junto) |

## 📋 Comandos Principais

| Comando          | Ação                        | Permissão      |
|------------------|-----------------------------|----------------|
| `/painelpolicia` | Cria o painel de registro    | Administradores|
| `/horas @user`   | Mostra relatório completo    | Todos         |

## 📸 Preview

### Painel Discord  
Painel de controle no Discord

### Web Dashboard  
Painel web administrativo

## 📝 Estrutura de Arquivos

```
📦 BatePontoBot-Discord
├── 📂 commands
│   ├── painelpolicia.js
│   └── horas.js
├── 📂 models
│   └── Registro.js
├── 📂 web (opcional)
│   └── painel-react
├── 📜 registroponto.js
├── 📜 api.js
└── 📜 index.js
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
