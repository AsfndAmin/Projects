import env from "environment"
import io from "socket.io-client"

export class CommonUtility {

    static socketIO = () => {
        const ENDPOINT = env.BACKEND_BASE_URL;
        const socket = io(ENDPOINT);
        return socket
    }

    static capitalizeFirstWord = (str: string) => {

        const str2 = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        console.log(str2, 'string')
        return str2
    }

    static mm_dd_yy = (date: Date) => {

        const d= new Date(date)
        const month = d.getMonth()
        const day = d.getDate()
        const year = d.getFullYear()
        return `${month+1}-${day}-${year}`
    }

};