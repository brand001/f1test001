import React from "react";
import { View } from "react-native";

import { translate } from "$locales/translate";

import DetailsTab from "./DetailsTab";
import { MemberLevelTab } from "./MemberLevelTab";
import NavTab from "$Components/Nav/NavTab";

const TABS = [
    {
        get label() {
            return translate("会员等级");
        },
        get component() {
            return <MemberLevelTab />;
        },
    },
    {
        get label() {
            return translate("权益");
        },
        get component() {
            return <DetailsTab />;
        },
    },
];

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabType: 0,
            tabsActive: 0,
        };
    }

    componentDidMount() {
        this.setNav();
    }

    setNav() {
        this.props.navigation.setParams({
            title: () => {
                return (
                    <NavTab
                        activeKey={this.state.tabType}
                        tabData={TABS.map(({ label }) => label)}
                        callBack={({ key }) => {
                            this.onTabSelect(key);
                        }}></NavTab>
                );
            },
        });
    }

    goToDetailsTab = () => {
        this.setState({ tabType: 1 }, () => {
            this.setNav();
        });
    };

    onTabSelect = tabId => {
        this.setState({ tabType: tabId }, () => {
            this.setNav();
        });
    };

    handleTabChange = index => {
        this.setState({ tabsActive: index });
    };

    render() {
        const { tabType, tabsActive } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: "#17191C" }}>
                {tabType === 0 && (
                    <MemberLevelTab
                        goToDetailsTab={this.goToDetailsTab}
                        tabsActive={tabsActive}
                        handleTabChange={this.handleTabChange}
                    />
                )}
                {tabType === 1 && <DetailsTab />}
            </View>
        );
    }
}

export default Index;
