import React from "react";
import { Text, Platform } from "react-native";
import { connect } from "react-redux";
import BankCard_CN from "./CentralPayment/CN/BankCard_CN";
import actions from "$LIB/redux/actions/index";
import BankCard_THVN from "./CentralPayment/THVN/BankCard_THVN";

class BankCard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.hideNavBar();
    }

    componentWillUnmount() {
        this.props.userInfo_getBalance(true);
        this.props.userInfo_updateMemberInfo();

    }

    hideNavBar = () => {
        this.props.navigation &&
            this.props.navigation.setParams({
                hideNavBar: true,
            });
    };

    render() {
        switch (window.LANGUAGE) {
            case "CN":
                return <BankCard_CN />;
            case "VN":
                return <BankCard_THVN />;
            case "TH":
                return <BankCard_THVN />;
            default:
                return <BankCard_CN />;
        }
    }
}



const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
    userInfo_getBalance: (forceUpdate = false) => dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BankCard);