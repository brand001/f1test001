import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import actions from "@/lib/redux/actions";

import Color from "$Components/Color";
import { HomeActiveIcon, HomeIcon, ProActiveIcon, ProfileActiveIcon, ProfileIcon, ProIcon, RecordActiveIcon, RecordIcon, SmartActiveIcon, SmartIcon, MaintenanceIcon } from "$Components/icons/index.js";
import { translate } from "$locales/translate";
import { ColumnStartCenter, RowCenterEnd } from "$Components/CustomView";
import CustomTooltip from "$Components/CustomTooltip";
import FilledButton from "$Components/FilledButton";
import StorageUtil from "$Utils/Storage";

const { width, height } = Dimensions.get("window");
class TabIconContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let selected = this.props.focused;
        let data = {
            Home: {
                title: translate("首页"),
                icon: selected => (selected ? <HomeActiveIcon language={window.LANGUAGE} /> : <HomeIcon language={window.LANGUAGE} />),
            },
            Personal: {
                title: translate("我的"),
                key: "Personal",
                icon: selected => (selected ? <ProfileActiveIcon /> : <ProfileIcon />),
            },
            BettingRecord: {
                title: translate("投注记录"),
                icon: selected => (selected ? <RecordActiveIcon /> : <RecordIcon />),
            },
            Promotion: {
                title: translate("优惠"),
                icon: selected => (selected ? <ProActiveIcon language={window.LANGUAGE} /> : <ProIcon language={window.LANGUAGE} />),
            },
            Smartico: {
                title: translate("彩金殿堂"),
                icon: selected => (selected ? <SmartActiveIcon /> : <SmartIcon />),
            },
        };

        let navigationKey = this.props.navigation.state.key;
        let param = data[navigationKey];
        let { title = "", icon = () => {} } = param;

        return (
            (navigationKey == "Personal" && !this.props.tutorialManager.hasCache && ApiPort.UserLogin && this.props.tutorialManager.index == 1)
                ?
                (
                    <CustomTooltip
                        visible={this.props.tutorialManager.index === 1}
                        placement="top"
                        Icon={
                            <ColumnStartCenter style={[styles.tabbarContainer, {
                                width: (width / Object.keys(data).length) * .8,
                                height: (width / Object.keys(data).length) * .8,
                                backgroundColor: "#fff",
                                borderRadius: 99,
                                flex: 0,
                                paddingTop: 10
                            }]}>
                                <View style={styles.tabIconImg}>{icon(selected)}</View>
                                <Text style={[styles.Text, { color: !selected ? Color.darkGray : Color.theme }]}>{title}</Text>
                            </ColumnStartCenter>
                        }
                        maskColor={"rgba(0, 0, 0, .5)"}
                        containerStyle={{
                            left: 0
                        }}
                        renderContent={({ callBack = () => {} }) => {
                            return <View>
                                <Text style={{ color: "#fff", fontWeight: "400", fontSize: 12, marginBottom: 10 }}>{translate("如需提款，请前往「我的」页面操作")}</Text>

                                <RowCenterEnd>
                                    <FilledButton
                                        fullWidth={false}
                                        wrapStyle={{
                                            paddingHorizontal: 8,
                                        }}
                                        onPress={() => {
                                            callBack(false);
                                            this.props.dispatch(actions.ACTION_TutorialManagerIndex(-1, true));
                                            // 保存教程完成状态
                                            StorageUtil.save({
                                                key: "tutorialCompleted" + window.memberCode,
                                                data: true,
                                            });
                                        }}
                                        type="medium"
                                        text={translate("我明白了")}
                                    />
                                </RowCenterEnd>
                            </View>;
                        }}
                    />
                )
                :
                <ColumnStartCenter style={[styles.tabbarContainer, { width: width / Object.keys(data).length }]}>
                    <View style={styles.tabIconImg}>{icon(selected)}</View>
                    {
                        navigationKey == "Smartico" && !this.props.userSetting?.cmsMainsiteStatus?.smarticoIsActive &&
                        <MaintenanceIcon width={10} height={10} wrapStyle={styles.mainBox} />
                    }

                    <Text style={[styles.Text, { color: !selected ? Color.darkGray : Color.theme }]}>{title}</Text>
                </ColumnStartCenter>
        );
    }
}

const mapStateToProps = state => ({
    gameMaintainStatus: state.gameInfo.maintainStatus,
    userSetting: state.userSetting,
    tutorialManager: state.userSetting.tutorialManager,
});

const mapDispatchToProps = dispatch => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(TabIconContainer);

const styles = StyleSheet.create({
    tabbarContainer: {
        flex: 1,
        marginTop: 4,
        position: "relative",
    },
    tabIconImg: {
        marginBottom: 2
    },
    Text: {
        fontSize: 10,
        textAlign: "center",
    },
    mainBox: {
        backgroundColor: Color.gray,
        borderRadius: 4,
        width: 14,
        height: 14,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 999,
        right: 14,
        top: 0
    }
});
