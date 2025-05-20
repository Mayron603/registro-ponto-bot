const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const Registro = require('./models/Registro');
const moment = require('moment');

const pontosAbertos = new Map();
let mensagemStatusId = null;

const COR_PADRAO = '#313338'; // Nova cor padrão escura

function criarEmbed(titulo, descricao, cor = COR_PADRAO, thumbnail = null, imagem = null) {
    const embed = new EmbedBuilder()
        .setColor(cor)
        .setTitle(`✨ ${titulo}`)
        .setDescription(descricao)
        .setFooter({
            text: 'Sistema de Registro - Criado por Mayron ⚡',
            iconURL: 'https://cdn-icons-png.flaticon.com/512/681/681494.png'
        })
        .setTimestamp();

    if (thumbnail) embed.setThumbnail(thumbnail);
    if (imagem) embed.setImage(imagem);
    return embed;
}

async function atualizarStatus(interaction) {
    try {
        const canal = interaction.channel || interaction;
        let mensagemStatus = mensagemStatusId 
            ? await canal.messages.fetch(mensagemStatusId).catch(() => null)
            : null;

        const embed = new EmbedBuilder()
            .setColor(COR_PADRAO)
            .setTitle('📡 OFICIAIS EM SERVIÇO')
            .setThumbnail('https://cdn.discordapp.com/attachments/1374083435085299712/1374435538508972262/image.png?ex=682e0a58&is=682cb8d8&hm=860d6fdbc95be95d6b8c886bdea535b78eb3c79e352c9261af8b3761a35a443a&')
            .setDescription(pontosAbertos.size > 0 
                ? Array.from(pontosAbertos.entries()).map(([userId, data]) => {
                    const tempo = moment.duration(moment().diff(moment(data.horario)));
                    return `> 👮‍♂️ **${data.username}** está em serviço há \`${tempo.hours()}h ${tempo.minutes()}m\``;
                  }).join('\n')
                    : '> ⚠️ Nenhum agente ativo no momento.\n> Clique no botão **INICIAR PLANTÃO** abaixo para entrar em serviço.')
            // .setImage('')
            .setFooter({
                text: 'Painel atualizado em tempo real • Mayron Dev',
                iconURL: 'https://cdn-icons-png.flaticon.com/512/4086/4086679.png'
            })
            .setTimestamp();

        if (!mensagemStatus) {
            mensagemStatus = await canal.send({ embeds: [embed] });
            mensagemStatusId = mensagemStatus.id;
        } else {
            await mensagemStatus.edit({ embeds: [embed] });
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
    }
}

async function registrarEntrada(userId, username, interaction) {
    const now = new Date();

    try {
        let registro = await Registro.findOne({ userId });

        if (registro && registro.pontos.some(p => !p.saida)) {
            return {
                error: true,
                embed: criarEmbed(
                    'VOCÊ JÁ ESTÁ EM SERVIÇO!',
                    '⚠️ Finalize o plantão atual antes de iniciar outro.',
                    '#E74C3C'
                )
            };
        }

        if (!registro) {
            registro = new Registro({ userId, username, pontos: [] });
        }

        registro.pontos.push({ entrada: now, saida: null });
        await registro.save();

        pontosAbertos.set(userId, { username, horario: now });
        await atualizarStatus(interaction);

        return {
            embed: criarEmbed(
                'ENTRADA CONFIRMADA',
                `👤 **Agente:** \`${username}\`\n🕓 **Entrada registrada:** \`${now.toLocaleTimeString("pt-BR")}\``,
                '#313338',
                'https://media.discordapp.net/attachments/1374083435085299712/1374434589648359565/image.png?ex=682e0975&is=682cb7f5&hm=e7950d6905855b545d93b2bf69785939215a38464c99075e046d4a8c09d8e3b6&=&format=webp&quality=lossless',
            )
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function registrarSaida(userId, username, interaction) {
    const now = new Date();

    try {
        let registro = await Registro.findOne({ userId });

        if (!registro || registro.pontos.length === 0) {
            return {
                embed: criarEmbed('ERRO', '❌ Nenhum ponto de entrada encontrado.', '#E74C3C'),
                error: true
            };
        }

        const ultimoPontoAberto = registro.pontos
            .filter(p => !p.saida)
            .sort((a, b) => new Date(b.entrada) - new Date(a.entrada))[0];

        if (!ultimoPontoAberto) {
            return {
                embed: criarEmbed('ERRO', '⚠️ Nenhum plantão em aberto localizado.', '#E74C3C'),
                error: true
            };
        }

        const horasTrabalhadas = ((now - ultimoPontoAberto.entrada) / 3600000).toFixed(2);
        ultimoPontoAberto.saida = now;
        await registro.save();

        pontosAbertos.delete(userId);
        await atualizarStatus(interaction);

        return {
            embed: criarEmbed(
                'SAÍDA CONFIRMADA',
                `👤 **Agente:** \`${username}\`\n` +
                `⏱️ **Entrada:** \`${ultimoPontoAberto.entrada.toLocaleTimeString("pt-BR")}\`\n` +
                `⏱️ **Saída:** \`${now.toLocaleTimeString("pt-BR")}\`\n` +
                `🧮 **Tempo total de serviço:** \`${horasTrabalhadas}h\``,
                '#313338',
                'https://media.discordapp.net/attachments/1374083435085299712/1374434589648359565/image.png?ex=682e0975&is=682cb7f5&hm=e7950d6905855b545d93b2bf69785939215a38464c99075e046d4a8c09d8e3b6&=&format=webp&quality=lossless',
            )
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function criarPainelRegistro() {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('registrar_entrada')
                .setLabel('INICIAR')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('registrar_saida')
                .setLabel('ENCERRAR')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('atualizar_status')
                .setLabel('ATUALIZAR')
                .setStyle(ButtonStyle.Secondary)
        );


    const embed = new EmbedBuilder()
        .setColor(COR_PADRAO)
        .setTitle('📋 REGISTRO DE PLANTÃO')
        .setThumbnail('https://cdn.discordapp.com/attachments/1374083435085299712/1374435308283629598/image.png?ex=682e0a21&is=682cb8a1&hm=e0c24ef196c0ebdac6167ce3846e8c28969d2c07c2123c7e00003200b206b0f6&')
        .setDescription(
            '🚔 **Bem-vindo ao sistema de registro!**\n\n' +
            '> Use os botões abaixo para **entrar ou sair do serviço**.\n' +
            '> Mantenha seus registros atualizados para evitar advertências.\n\n' +
            '🧠 *Atenção: Encerrar o plantão é de responsabilidade do agente.*'
        )
        // .setImage('')
        .setFooter({
            text: ' | Sistema de Plantão Digital',
            iconURL: 'https://cdn-icons-png.flaticon.com/512/681/681494.png'
        });

    return { embeds: [embed], components: [row] };
}

module.exports = {
    registrarEntrada,
    registrarSaida,
    criarPainelRegistro,
    atualizarStatus,
    setup: async (client) => {
        client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;

            const { customId, user } = interaction;

            try {
                if (customId === 'registrar_entrada') {
                    const result = await registrarEntrada(user.id, user.username, interaction);
                    await interaction.reply({ embeds: [result.embed], ephemeral: true });
                } else if (customId === 'registrar_saida') {
                    const result = await registrarSaida(user.id, user.username, interaction);
                    await interaction.reply({ embeds: [result.embed], ephemeral: true });
                } else if (customId === 'atualizar_status') {
                    await interaction.deferReply({ ephemeral: true });
                    await atualizarStatus(interaction);
                    await interaction.editReply('✅ Status atualizado com sucesso!');
                }
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: '❌ Um erro inesperado ocorreu.',
                    ephemeral: true
                });
            }
        });
    }
};
