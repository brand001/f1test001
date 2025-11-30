import React, { useEffect } from "react";
import { View } from "react-native";

import { translate } from "@/locales/translate";
import CustomFlatList from "$Components/CustomFlatList";
import { RecordDetailItem } from "$Components/RecordItem";

const defaultContainerStyle = {
    flex: 1,
    backgroundColor: "#EFEFF4",
    paddingTop: 15,
};

const RecordDetail = ({ pageTitle = "", navigation, dataList = [] }) => {
    useEffect(() => {
        navigation?.setParams?.({
            title: pageTitle,
        });
    }, []);

    const renderItem = ({ item, index }) => {
        if (!item) return null;

        return <RecordDetailItem key={index} items={item.items} />;
    };

    return (
        <View style={[defaultContainerStyle]}>
            <CustomFlatList
                data={dataList}
                numColumns={1}
                renderItem={renderItem}
                emptyText={translate("暂无记录")}
                loadingMoreText={translate("加载更多…")}
                noMoreText={translate("没有更多了")}
            />
        </View>
    );
};

export default RecordDetail;

