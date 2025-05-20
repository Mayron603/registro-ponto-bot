const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { criarPainelRegistro, atualizarStatus } = require('../registroponto');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painelpolicia')
        .setDescription('[COMANDO RESTRITO] Cria o painel de registro policial')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '🚨 ACESSO NEGADO: Apenas comandantes podem usar este comando!',
                ephemeral: true
            });
        }

        try {
            // Resposta efêmera (só o autor vê)
            await interaction.reply({
                content: '✅ Painel de registro criado com sucesso!',
                ephemeral: true
            });

            // Envia apenas o embed com os botões (sem mensagem adicional)
            await interaction.channel.send(criarPainelRegistro());

            // Atualiza o status
            await atualizarStatus(interaction);

            // Apaga a confirmação após 2 segundos
            setTimeout(() => {
                interaction.deleteReply().catch(console.error);
            }, 2000);

        } catch (error) {
            console.error('Erro ao criar painel policial:', error);
            await interaction.reply({
                content: '🚨 ERRO: Falha ao criar o painel de registro',
                ephemeral: true
            });
        }
    }
};