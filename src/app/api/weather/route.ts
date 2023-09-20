import { NextRequest,NextResponse } from "next/server";

export async function GET(request : any,) {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city');

    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    let url = '';
    if(city){
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fe615414935ea9d945008066be9c6049`;
    }else{
        url = `https://api.openweathermap.org/data/2.5/weather?lat${lat}&lon=${lon}&appid=fe615414935ea9d945008066be9c6049`;
    }

    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json({data});
  
}