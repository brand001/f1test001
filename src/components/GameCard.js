import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ColumnCenterStart, RowCenterStart } from '$Components/CustomView';
import NetworkImage from "$Components/NetworkImage";
import { InforNormalIcon } from "$Components/icons";

// import { 6 } from "../components/data";

const GameCard = (props) => {
    const {
        gameItem,
        index,
        providersMap,
        itemWidth,
        itemHeight,
        onGameInfoClick = () => {},
        listType = '',
        showGameInfor = false,
        piwikCallBack = () => {}
    } = props;

    const {
        gameName = '',
        provider = '',
        imageUrl = null,
        imageUrlWebp = '',
        gameId = '',
        launchGameCode = '',
        gameType = ''
    } = gameItem;

    const {
        name = '',
        providerName = '',
        icon = null,
        iconFull = null,
        iconWebp = null
    } = providersMap[provider] || providersMap[gameType] || {};

    const iconUrl = icon || iconFull || iconWebp;


    return <View key={index} style={[styles.gameCardContainer, styles[`gameCardContainer${index % 2}`]]}>
        {
            showGameInfor &&
            <InforNormalIcon
                onPress={() => {
                    onGameInfoClick(gameItem)
                }}
                fill={'#fff'}
                wrapStyle={styles.inforIcon}
            />
        }

        <TouchableOpacity
            key={index}
            style={[styles.gameCardImageContainer, { width: itemWidth, height: itemHeight }]}
            onPress={() => {
                onGameInfoClick(gameItem)

                //onLaunchGame(gameItem);
                piwikCallBack(gameItem);
            }}
        >

            <NetworkImage
                style={styles.gameCardImage}
                resizeMode="stretch"
                source={{ uri: imageUrl }}
            />
        </TouchableOpacity>


        <ColumnCenterStart style={[styles.gameCardTitleContainer, { width: itemWidth }]}>
            <Text style={styles.gameCardGameTitle} numberOfLines={2} ellipsizeMode="tail">
                {gameName}
            </Text>
        </ColumnCenterStart>
        <RowCenterStart style={styles.gameCardProviderContainer}>
            <Image
                style={styles.gameCardProviderIcon}
                resizeMode="stretch"
                source={{ uri: iconUrl }}
            />
            <Text style={styles.gameCardProviderName}>{name || providerName}</Text>
        </RowCenterStart>
    </View>
};

const styles = StyleSheet.create({
    gameCardContainer: {
        // marginHorizontal: 4
        marginRight: 8
    },
    gameCardContainer0: {
        //marginRight: 8
    },
    gameCardImageContainer: {
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 4,
    },
    gameCardImage: {
        width: '100%',
        height: '100%',
    },
    gameCardTitleContainer: {
        height: 28,
        flexWrap: 'wrap',
    },
    gameCardGameTitle: {
        color: '#222222',
        fontSize: 12,
        fontWeight: '600',
        flexWrap: 'wrap'
    },
    gameCardProviderContainer: {
        height: 16,
    },
    gameCardProviderIcon: {
        width: 16,
        height: 16,
        marginRight: 4,
    },
    gameCardProviderName: {
        fontSize: 10,
        color: '#666666',
        fontWeight: '400',
    },
    inforIcon: {
        position: 'absolute',
        top: 6,
        right: 6,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: 20,
        height: 20,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        zIndex: 99
    }
});

export default GameCard; 