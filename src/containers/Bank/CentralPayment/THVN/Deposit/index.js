import React from "react";
import { connect } from "react-redux";
import DepositOld from "./components/DepositCenterOld";
import DepositNew from "./components/DepositCenterNew";

import { translate } from "@/locales/translate";
import { GetGlobalModal } from "$Utils/globalModal";

class Deposit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleCentralPayment: "",
            openNewVersion: false,
        };

        this.Methods = {
            "CTC": {
                icon: "CTC",
                name: translate("使用加密貨幣付款"),
                iconSize: { width: 45, height: 45 },
            },
            "LB": {
                icon: "LB",
                name: "qua ngân hàng dịa phương",
                iconSize: { width: 45, height: 45 },
            },
            "QD": {
                icon: "LB",
                name: "qua ngân hàng dịa phương",
                iconSize: { width: 45, height: 45 },
            },
        };
    }

    componentDidMount() {
        if (this.state.toggleCentralPayment && this.props.centralPayment?.useCentralPayment) {
            this.hideNavBar();
        }
    }

    hideNavBar = () => {
        this.props.navigation &&
            this.props.navigation.setParams({
                hideNavBar: true,
            });
    };

    toggleCentralPaymentHandler = (val = "", modalVisible = false) => {
        this.setState({ toggleCentralPayment: val, openNewVersion: modalVisible });
    };

    openNewVersionHandler = () => {
        const { openNewVersion } = this.state;
        this.setState({ openNewVersion: !openNewVersion });
    };

    componentDidUpdate(prevProps, prevState) {
        // 只在 toggleCentralPayment 变为非空且 openNewVersion 为 false 时弹窗
        if (
            prevState.toggleCentralPayment !== this.state.toggleCentralPayment ||
            prevState.openNewVersion !== this.state.openNewVersion
        ) {

        }

        let { toggleCentralPayment = "", openNewVersion = "" } = this.state;
        if (toggleCentralPayment !== "" && !openNewVersion && this.props?.userInfo?.memberInfo?.firstName) {
            GetGlobalModal({
                showCloseIcon: true,
                title: translate("体验我们的最新版本"),
                message: translate("我们改进了您的加密支付体验下一步将在新页面中打开。{X}", { X: this.Methods[toggleCentralPayment]?.name }),
                confirmText: translate("deposit好的"),
                iconName: this.Methods[toggleCentralPayment]?.icon,
                onConfirm: () => {
                    this.setState({ openNewVersion: true });
                },
                onCancel: () => {},
            });
        }

    }

    render() {
        const { toggleCentralPayment, openNewVersion } = this.state;
        const { userInfo, centralPayment } = this.props;
        const { useCentralPayment, forceToggleCentralPayment, centralPaymentStatus } = centralPayment || {};

        const paymentRiskList = centralPaymentStatus?.paymentRiskList?.map(element => element?.toUpperCase()) || [];
        const memberRisk = userInfo?.memberInfo?.memberPaymentRisk?.paymentRisk?.toUpperCase();
        const accessNewPaymentPermission = useCentralPayment
            && paymentRiskList?.includes(memberRisk);

        const childProps = {
            toggleCentralPayment: toggleCentralPayment,
            toggleCentralPaymentHandler: this.toggleCentralPaymentHandler,
            accessNewPaymentPermission,
        };
        const openNewUI = accessNewPaymentPermission || (toggleCentralPayment && openNewVersion);
        return (
            <>
                {
                    openNewUI ? (
                        <DepositNew
                            {...childProps}
                            {...this.props}
                        />
                    )
                        : (
                            <DepositOld
                                {...this.props}
                                {...childProps}
                            />
                        )}
            </>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    centralPayment: state.centralPayment,
});

export default connect(mapStateToProps)(Deposit);
