const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Registro = require('../models/Registro');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('horas')
        .setDescription('Mostra o relatório completo de horas de um usuário')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para consultar as horas')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        
        try {
            const registro = await Registro.findOne({ userId: user.id });

            if (!registro || registro.pontos.length === 0) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#313338')
                            .setTitle('❌ Nenhum registro encontrado')
                            .setDescription(`O usuário ${user.username} não possui registros de ponto`)
                    ],
                    ephemeral: true
                });
            }

            // Agrupa por dia e calcula totais
            const dias = registro.pontos.reduce((acc, ponto) => {
                if (!ponto.saida) return acc;
                
                const data = moment(ponto.entrada).format('DD/MM/YYYY');
                const horas = (ponto.saida - ponto.entrada) / (1000 * 60 * 60);
                
                if (!acc[data]) {
                    acc[data] = {
                        total: 0,
                        pontos: []
                    };
                }
                
                acc[data].total += horas;
                acc[data].pontos.push({
                    entrada: ponto.entrada,
                    saida: ponto.saida,
                    horas: horas.toFixed(2)
                });
                
                return acc;
            }, {});

            // Cria os fields para o embed
            const fields = Object.entries(dias).map(([data, dia]) => {
                const pontosFormatados = dia.pontos.map(p => 
                    `⏰ ${moment(p.entrada).format('HH:mm')} - ${moment(p.saida).format('HH:mm')} (${p.horas}h)`
                ).join('\n');
                
                return {
                    name: `📅 ${data} - Total: ${dia.total.toFixed(2)}h`,
                    value: pontosFormatados,
                    inline: false
                };
            });

            // Calcula o total geral
            const totalGeral = Object.values(dias).reduce((sum, dia) => sum + dia.total, 0);

            const embed = new EmbedBuilder()
                .setColor("#313338")
                .setTitle(`📊 Relatório de Horas - ${user.username}`)
                .setDescription(`Registro completo de horas trabalhadas`)
                .addFields(fields)
                .addFields({
                    name: '**TOTAL GERAL**',
                    value: `🕒 ${totalGeral.toFixed(2)} horas`,
                    inline: false
                })
                .setFooter({ text: `Solicitado por ${interaction.user.username}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Ocorreu um erro ao gerar o relatório',
                ephemeral: true
            });
        }
    }
};