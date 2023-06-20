import { useCookies } from "react-cookie";

const CookieBar = () => {
    const [, setCookie] = useCookies(["accept"])
    const accept = () => {
        setCookie("accept", true)
    }
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-3xl">
            <div className="flex justify-between items-center px-8 py-4">
                <span className="text-black">This website uses cookies to enhance the user experience.</span>
                <button className="px-3 sm:px-6 h-6 sm:h-[32.36px] bg-green2 rounded-tiny sm:rounded-sm" onClick={accept}>Accept</button>
            </div>
        </div>
    )
}

export default CookieBar;