import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

export const TheAvatar = ({name}) =>{
    let namet = name.trim();
    if(namet.length === 0){
        return <Avatar icon={<UserOutlined/>} />
    } else {
        const split = namet.split(" ");
        if(split.length === 1){
            return <Avatar>{name.charAt(0)}</Avatar>
        } else {
            return <Avatar>{`${name.charAt(0)}${name.charAt(name.length - 1)}`}</Avatar>
        }
    }
}