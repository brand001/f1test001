import { AmityUiKitChat, AmityUiKitProvider } from "@amityco/react-native-cli-chat-ui-kit";
import React from "react";

const AmityChat = ({ amityToken }) => {
    let displayName = window?.memberCode?.replace(/"/g, "");
    let apiKey = window.isStaging == "ST" ? "b0eaef0e3888f23044338b15540d13ded40a89b6ec313e2d" : "b0eabb5e3c8ff9611f358e1e530f408fd1588ce5be616f79";
    let customerServiceRoleId = window.isStaging == "ST" ? "94e6142a-e287-4043-b78d-567b4b3e13fa" : "e9119dd5-fc3d-4fe7-b838-670874389d0e";
    let vipUserRoleId = window.isStaging == "ST" ? "cd86f23b-e12e-4a97-a2d1-5ce439449420" : "d90db998-f1a2-4532-8d49-954e0476f704";

    return (
        <AmityUiKitProvider
            apiKey={apiKey} // Put your apiKey
            apiRegion="sg" // Put your apiRegion
            userId={displayName} // Put your UserId
            displayName={displayName} // Put your displayName
            apiEndpoint="https://api.sg.amity.co" //"https://api.{apiRegion}.amity.co"
            roleConfig={{
                customerServiceRoleId: customerServiceRoleId,
                vipUserRoleId: vipUserRoleId,
            }}
            authToken={amityToken} //call /api/Auth/GetAmityToken api获取
            language="cn" //zh, en, th, vn
        >
            <AmityUiKitChat />
        </AmityUiKitProvider>
    );
};

export default AmityChat;
