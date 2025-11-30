import React from "react";
import { GetSelfExclusionPopup } from "$Utils";
import Withdrawal_CN from "./CentralPayment/CN/Withdrawal_CN";
import Withdrawal_THVN from "./CentralPayment/THVN/Withdrawal_THVN";


import { connect } from "react-redux";
import actions from "$LIB/redux/actions/index";


class WithdrawCenter extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.hideNavBar();

        let isSelfExclusionPopup = await GetSelfExclusionPopup();
        if (isSelfExclusionPopup) return;
    }

    componentWillUnmount() {
        this.props.userInfo_getBalance(true);
        this.props.userInfo_updateMemberInfo();

    }

    hideNavBar = () => {
        this.props.navigation.setParams({
            hideNavBar: true,
        });
    };



    render() {
        switch (window.LANGUAGE) {
            case "CN":
                return <Withdrawal_CN></Withdrawal_CN>;
            case "TH":
                return <Withdrawal_THVN></Withdrawal_THVN>;
            case "VN":
                return <Withdrawal_THVN></Withdrawal_THVN>;
            default:
                return <Withdrawal_CN></Withdrawal_CN>;
        }
    }
}


const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
    userInfo_getBalance: (forceUpdate = false) => dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawCenter);