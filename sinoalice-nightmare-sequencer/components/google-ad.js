import { useEffect } from "react";


export default function GoogleAd(props)
{
    useEffect(() => {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, [])

    return (
        <ins className="adsbygoogle"
        style={{display: 'block'}}
        data-ad-client={props.client}
        data-ad-slot={props.slot}
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    )
}