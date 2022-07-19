import { useEffect } from "react";


export default function GoogleAd(props)
{
    useEffect(() => {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, [])

    return (
        <ins className="adsbygoogle"
        style={props.display}
        data-ad-client={props.client}
        data-ad-slot={props.slot}
        data-ad-format={props.format}
        data-full-width-responsive="true"></ins>
    )
}