import { useEffect } from "react";

export default function GoogleAd(props)
{
    useEffect(() => {
        try
        {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
        catch(err)
        {
            //Error with google ads. Usually occurs when no mobile, and there are no ads available for div width
            //console.log(err)
        }
    }, [])

    return (
        <ins className="adsbygoogle"
        style={props.display}
        data-ad-client={props.client}
        data-ad-slot={props.slot}
        data-ad-format={props.format}
        data-full-width-responsive={props.responsiveWidth}></ins>

    )
}