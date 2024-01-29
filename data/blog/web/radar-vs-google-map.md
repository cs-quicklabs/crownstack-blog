---
title: "Radar & Google Maps: A Side-by-Side Comparison"
date: '2024-01-29'
lastmod: '2024-01-29'
tags: ['maps','radar','google']
draft: false
summary: "In this article we are going to do comprehensive comparative analysis between two prominent mapping service providers: Radar Maps and Google Maps"
layout: PostSimple
images: []
authors: ['abhishek-kumar']
---

In an era where digital maps have seamlessly woven into the fabric of our daily lives, the selection of a dependable and feature-rich mapping service stands as a pivotal decision, capable of profoundly influencing both user experiences and the efficiency of business operations. As software engineers, our perpetual quest to deliver unparalleled experiences to our audience leads us to explore various services within our applications. In this pursuit, we often confront the decision of whether to build an in-house solution or leverage third-party services. Integration of a third-party service necessitates careful consideration of factors such as seamless integration, scalability, extension support, easy maintenance, and, notably, cost efficiency.

This blog embarks on a comprehensive comparative analysis between two prominent mapping service providers: Radar Maps and Google Maps. Throughout this document, we will unravel insights into cost comparisons, assess the quality of responses, and delineate scenarios where each service excels, aiding in the strategic selection of the ideal mapping solution for diverse contexts.

![Radar Vs Google](/static/images/blogs/web/radar-vs-google-maps/radar-logo.jpg "Radar Vs Google")

## Introduction

In my six years as a backend developer, I've had the opportunity to design various applications and software systems. Incorporating third-party services has been a common practice in our journey to enhance the features we offer. Selecting the right third-party API is crucial, given the multitude of options available in the market, and reliability and robustness are key considerations.

Project owners and managers frequently rely on our expertise to choose the most suitable third-party services for their applications. This process is driven by our commitment to delivering optimal solutions. One noteworthy instance involved the development of an e-logistics application, where we opted for Google Maps, a widely recognised third-party service, to meet the diverse needs of the application.

Let me shed light on why Google Maps became essential in this scenario. The platform played a pivotal role in ensuring the smooth delivery of goods to customers' doorsteps, providing crucial functionalities such as route calculation, location coordinate retrieval, real-time driver tracking, and accurate time estimations for fair customer fees. The strategic integration of Google Maps proved instrumental in guaranteeing a seamless and efficient logistics service for our client.

However, as time passed, the application's user base surged from hundreds to thousands. Consequently, the usage of the Google Maps API increased, leading to a significant rise in monthly billing costs from a few dollars to several thousand dollars. This prompted a search for an alternative to Google Maps that wouldn't compromise the quality of our results. That's when we discovered Radar Maps.

As both Google Maps and Radar Maps provides lots of API such as  Geocoding, Routes and many more. But in this blog we will talk about the APIs I’ve used which are Routes API from both Google and Radar both. While comparing both the API we will talk about for each API:

- Request Payload
- Response
- Similarities
- Differences

These are the API we will talk about

- **Google Maps**
    - Distance Matrix API
    - Directions API
- **Radar Maps**
    - Route Matrix API
    - Directions API

## Google Maps: Distance Matrix Vs Radar Maps: Route Matrix

Although the names are different but both of these API do the same work.

The Distance Matrix API is a service that accepts HTTPS request containing origins and destinations for a given mode of transport. The Distance Matrix API provides information based on the recommended route:

- Distance
- Duration

Now, lets talk about comparison factors one by one:

---

## **Google**

Google's Distance API request typically follows the format of a URL with specific parameters. Here is a general structure of how a request might look:

```jsx
https://maps.googleapis.com/maps/api/distancematrix/outputFormat?parameters
```

where `outputFormat` maybe either of the following values:

- `json`
- `xml`

`parameters` are divided into two groups Required & Optional

**Required Parameters:**

- `destinations` - One or more locations to use as the finishing point for calculating travel distance and time.You can supply one or more locations separated by the pipe character (|), in the form of a place ID, an address, or latitude/longitude coordinates:
- `origins` - One location which will be the starting point but you can pass a set of locations separated by the pipe character (|) if you want to calculate distance between multiple location such as distance from A to B, B to C and C to D.

`destinations` and `origins` can be passed as Place ID, Addresses, Coordinates, Plus Codes and Encoded Polyline. In my case I used coordinates.

**Optional Parameters:**

In my use case I was not using any of the optional parameters but if you want to learn about these option parameters, you can refer [here](https://developers.google.com/maps/documentation/distance-matrix/distance-matrix#optional-parameters).

**Sample Request:**

This is how a sample request will look like:

```json
curl "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=19.434069858962054,-99.12508165077894|19.42717,-99.1609062|19.4713369,-99.1883185|19.4248097,-99.19492559999999&destinations=19.42717,-99.1609062|19.4713369,-99.1883185|19.4248097,-99.19492559999999|19.4332743,-99.0894663&distance_unit=metric&key={YOUR_GOOGLE_MAP_API_KEY}"
```

**Sample Response:**

Google provides the response in two format, `json` and `xml`. Let’s see how the `json` response looks like:

```json
{
  "destination_addresses": [
    "Londres 61-Piso 14, Juárez, Cuauhtémoc, 06600 Ciudad de México, CDMX, Mexico",
    "Av. Centenario 25, Nextengo, Azcapotzalco, 02070 Ciudad de México, CDMX, Mexico",
    "Av. P.º de la Reforma 50, Polanco V Secc, Miguel Hidalgo, 11580 Ciudad de México, CDMX, Mexico",
    "Blvd. Puerto Aéreo 390, Moctezuma 2da Secc, Venustiano Carranza, 15530 Ciudad de México, CDMX, Mexico"
  ],
  "origin_addresses": [
    "República de Guatemala 639, Centro, Cuauhtémoc, 06020 Ciudad de México, CDMX, Mexico",
    "Londres 61-Piso 14, Juárez, Cuauhtémoc, 06600 Ciudad de México, CDMX, Mexico",
    "Av. Centenario 25, Nextengo, Azcapotzalco, 02070 Ciudad de México, CDMX, Mexico",
    "Av. P.º de la Reforma 50, Polanco V Secc, Miguel Hidalgo, 11580 Ciudad de México, CDMX, Mexico"
  ],
  "rows": [
    {
      "elements": [
        {
          "distance": {
            "text": "5.3 km",
            "value": 5279
          },
          "duration": {
            "text": "23 mins",
            "value": 1363
          },
          "status": "OK"
        },
        {
          "distance": {
            "text": "11.1 km",
            "value": 11059
          },
          "duration": {
            "text": "32 mins",
            "value": 1910
          },
          "status": "OK"
        },
        {
          "distance": {
            "text": "13.4 km",
            "value": 13442
          },
          "duration": {
            "text": "29 mins",
            "value": 1743
          },
          "status": "OK"
        },
        {
          "distance": {
            "text": "8.1 km",
            "value": 8060
          },
          "duration": {
            "text": "17 mins",
            "value": 1004
          },
          "status": "OK"
        }
      ]
    },
.
.
.
```

Due to large file size, I’ve attached the file which you can download to check the response.

[Click here to download response json.](/static/images/blogs/web/radar-vs-google-maps/google_distance_matrix_response.json "Google Distance Matrix Response")

Above file contains the Google’s Distance Matrix API’s response for above provided request payload.

---

### **Radar**

Radar’s Route Matrix API request typically follows the format of a URL with specific parameters. Here is a general structure of how a request might look:

```json
curl "https://api.radar.io/v1/route/matrix?parameters" \
  -H "Authorization: {RADAR_PUBLISHABLE_CLIENT_KEY}"
```

Here also, `parameters` are divided into two groups Required & Optional:

**Required Parameters:**

- `destinations` - One or more locations to use as the finishing point for calculating travel distance and time.You can supply one or more locations separated by the pipe character (|), in the form of latitude/longitude coordinates:
- `origins` - One location which will be the starting point but you can pass a set of locations separated by the pipe character (|) if you want to calculate distance between multiple location such as distance from A to B, B to C and C to D.

**Optional Parameters:**

- `units` -  The distance units. A string, `metric` or `imperial`. Defaults to `imperial` if not provided.

In my use case I was only using above optional parameters but if you want to learn about remaining optional parameters, you can refer [here](https://radar.com/documentation/api#matrix).

**Sample Radar Request:**

```json
curl "https://api.radar.io/v1/route/matrix?units=metric&origins=19.434069858962054,-99.12508165077894|19.42717,-99.1609062|19.4713369,-99.1883185|19.4248097,-99.19492559999999&destinations=19.42717,-99.1609062|19.4713369,-99.1883185|19.4248097,-99.19492559999999|19.4332743,-99.0894663" \
  -H "Authorization: {RADAR_PUBLISHABLE_CLIENT_KEY}"
```

**Sample Radar Response:**

Radar provides response in `JSON` format which looks like this: Let’s see how the `json` response looks like:

```json
{
    "meta": {
        "code": 200
    },
    "origins": [
        {
            "latitude": 19.43407,
            "longitude": -99.125082
        },
        {
            "latitude": 19.42717,
            "longitude": -99.160906
        },
        {
            "latitude": 19.471337,
            "longitude": -99.188318
        },
        {
            "latitude": 19.42481,
            "longitude": -99.194926
        }
    ],
    "destinations": [
        {
            "latitude": 19.42717,
            "longitude": -99.160906
        },
        {
            "latitude": 19.471337,
            "longitude": -99.188318
        },
        {
            "latitude": 19.42481,
            "longitude": -99.194926
        },
        {
            "latitude": 19.433274,
            "longitude": -99.089466
        }
    ],
    "matrix": [
        [
            {
                "distance": {
                    "value": 5039,
                    "text": "5.0 km"
                },
                "duration": {
                    "value": 7.773333333333334,
                    "text": "8 mins"
                },
                "originIndex": 0,
                "destinationIndex": 0
            },
            {
                "distance": {
                    "value": 12960,
                    "text": "13.0 km"
                },
                "duration": {
                    "value": 17.398333333333333,
                    "text": "17 mins"
                },
                "originIndex": 0,
                "destinationIndex": 1
            },
            {
                "distance": {
                    "value": 14019,
                    "text": "14.0 km"
                },
                "duration": {
                    "value": 14.520000000000001,
                    "text": "15 mins"
                },
                "originIndex": 0,
                "destinationIndex": 2
            },
            {
                "distance": {
                    "value": 7953,
                    "text": "8.0 km"
                },
                "duration": {
                    "value": 9.680000000000001,
                    "text": "10 mins"
                },
                "originIndex": 0,
                "destinationIndex": 3
            }
        ],
.
.
.
```

Due to large file size, I’ve attached the file which you can download to check the response.

[Click here to download response json.](/static/images/blogs/web/radar-vs-google-maps/radar_route_matrix_response.json "Radar Route Matrix Response")

Above file contains the Radar’s Route Matrix API’s response for above provided request payload.


**Comparison**

Now, we will talk about the similarities and differences between Radar’s & Google Route & Distance  Matrix API respectively:

**Similarities**:

- Both has the capability to pass a matrix of origins and destination to calculate the distance and duration between more than 2 set of coordinates.
- Integration of both the API seems very easy and does not required any special challenge.
- The response time of both the APIs are quite similar.

**Differences:**

| Google Distance Matrix | Radar Route Matrix |
| --- | --- |
| Google offers the flexibility to use latitude-longitude coordinates, place IDs, or string addresses for both origins and destinations in the request payload. | In contrast, Radar restricts the options by only permitting the use of latitude-longitude coordinates in the request payload. |
| Google allows users to choose the response format by specifying either JSON or XML in the request payload. | In contrast, Radar lacks this feature, and the only available response format is JSON. |
| Google offers a plethora of optional parameters that contribute to obtaining more nuanced and precise results. For instance, including parameters such as arrival_time or departure_time allows Google to factor in real-time traffic conditions when calculating the duration. The availability of various other parameters further enhances the customisation options for users. | In contrast, Radar provides some optional parameters, but they lack the advanced features found in Google's offerings. This limitation restricts the extent to which users can refine their queries, limiting the available information to basic details such as distance and duration. |
| In its response, Google provides two keys: distance and duration. Each key contains both a text and a value field. The value field consistently represents the distance in meters, regardless of the unit specified in the request. On the other hand, the text field corresponds to a string representation and adjusts based on the unit passed in the request—displaying values in kilo-meters for metric units and in miles for imperial units. This approach is beneficial for developers, as it simplifies the implementation logic, eliminating the need to alter the function based on the unit parameter. | Similarly, Radar adheres to a comparable response structure. However, the key distinction lies in the value parameter, which varies according to the unit specified in the request payload. When the unit is metric, the value is expressed in meters, whereas with an imperial unit, it is provided in feet. This design places the responsibility on the developer to handle the value parameter in the function logic, adapting to the unit passed in the request payload. |

---

## Google Maps: Directions API Vs Radar Maps: Directions API

The directions API is a service using which you can get directions/routes between two or more locations to visit in order. The directions API provides the following information:

- Travel time
- Distance
- Polyline for the route

Let’s now understand about this API by each service provider.

---

### **Google**

Google's Directions API request typically follows the format of a URL with specific parameters. Here is a general structure of how a request might look:

```json
https://maps.googleapis.com/maps/api/directions/json?parameters
```

where `outputFormat` maybe either of the following values:

- `json`
- `xml`

`parameters` are divided into two groups Required & Optional

**Required Parameters:**

- `destinations` - This parameter contains the destination’s either Place ID, address or lat-long coordinates.
- `origins` - This parameter contains the origin’s either Place ID, address or lat-long coordinates.

`destinations` and `origins` can be passed as Place ID, Addresses, Coordinates, Plus Codes and Encoded Polyline. In my case I used coordinates.

**Note**: Directions API returns the route between one origin and one destination, if you want to calculate the route between more than 2 points you need to pass an optional parameter `waypoints` .

**Optional Parameters:**

- `units` -  The distance units. A string, `metric` or `imperial`. Defaults to `imperial` if not provided.
- `waypoints` - Waypoints are the locations we want the route for while reaching from origin to destination. Multiple waypoints can be passed using `|` as a separator. You can pass Place ID, address or lat-long as the waypoints.

In my use case I was only using above optional parameters but if you want to learn about remaining optional parameters, you can refer [here](https://developers.google.com/maps/documentation/directions/get-directions#optional-parameters).

**Sample Request**

```json
https://maps.googleapis.com/maps/api/directions/json?
origin=19.434069858962054,-99.12508165077894
&destination=19.4332743,-99.0894663
&units={YOUR_API_KEY}
&waypoints=19.42717,-99.1609062|19.4713369,-99.1883185|19.4248097,-99.19492559999999
```

**Sample Response:**

Google provides the response in two format, `json` and `xml`. Let’s see how the `json` response looks like:

```json
{
    "geocoded_waypoints": [
        {
            "geocoder_status": "OK",
            "place_id": "ChIJ9cd3NDX50YURTdLw8eZ3IWQ",
            "types": [
                "street_address"
            ]
        },
        {
            "geocoder_status": "OK",
            "place_id": "ChIJ39U8BaX_0YURZOHttjQn_Qs",
            "types": [
                "establishment",
                "point_of_interest"
            ]
        },
        {
            "geocoder_status": "OK",
            "place_id": "ChIJK-WYjYH40YURstfHsreHbzY",
            "types": [
                "church",
                "establishment",
                "place_of_worship",
                "point_of_interest"
            ]
        },
        {
            "geocoder_status": "OK",
            "place_id": "ChIJ-R6gAvwB0oURb42WS821FF4",
            "types": [
                "establishment",
                "point_of_interest",
                "tourist_attraction"
            ]
        },
        {
            "geocoder_status": "OK",
            "place_id": "ChIJW8MJYwj80YURc0q6XMSv-ks",
            "types": [
                "establishment",
                "lodging",
                "point_of_interest"
            ]
        }
    ],
    "routes": [
        {
            "bounds": {
                "northeast": {
                    "lat": 19.4726891,
                    "lng": -99.0832049
                },
                "southwest": {
                    "lat": 19.3982123,
                    "lng": -99.1958971
                }
            },
            "copyrights": "Map data ©2024 INEGI",
            "legs": [{ROUTE STEPS TRUNCATED DUE TO LARGE SIZE, DOWNLOAD ATTACHED FILE.}],
            "overview_polyline": {
                "points": "suruBxj_|QRuC|Eb@vHn@tBVrGh@`EZrOnAT@OhBy@rJu@hJM~@Bh@f@xAf@fAJZMbF_@jJQfE|DZ{@hSa@jJiAzIsDi@AbA@ZYhHi@zJUlHKnDzCdQhBjKJd@PT?LF|@ZzBr@~ErB|NTbBJt@[NcHxC`@jAt@vBFNoD|AcBoEcCyGnDyAt@fBjErLpCvHfGpP^`AFPmD|A}D`B{D`BmAd@CECISUm@M]D]RSb@CX?JINe@ZQN]PkGjCeEbBsKtEaEfBeD~@iCp@uEhBiCv@yEfBUBeAGo@IiCpE_FfIaAdAu@j@qErCyAjAsDvCsG`F_L`JyBdB}LnJmOtLcL~IuExDq@f@{@\\yMxCeGnA{Cr@kDl@oCLcDAea@aBeNk@gCKsEWi@KGEMAWCJgA@UBGZU^Kr@?v@AzGXh@B~@DERI`@EJi@fBIVGPZ@\\BdBHjLd@rGVnA?~@GpMf@zEFlCOxAQzD}@lDu@|FoAvJ{BbAi@pDkC|GcFh\\kWZM^DzBPpUdBhXrBd@DnEEvEQdAStE{AvM}DnDaAxE}AdBq@lBm@^nAf@tA|@tCBXIDMT@\\LPTFNCTX|@nCf@xAxBvGrEfNhCxHVl@HHlAfDvAdEj@j@h@NfE\\bDXr@LxD^rBPzANTJGL[NwAl@m@p@WHKV?JK`@kAlAUNETg@dGENMRg@HyI{@@YAXrCVzE`@VML]d@qF|BwBTML?JARS@]OWEAEC^a@f@[p@Wd@UFIZEj@?|BRpA\\bCrAdB`Ah@Vz@VlARdCBXArA[tEoB`D{A~FiDzAy@tEgAdHwBhE{AtEaB|EgB|GqCbI{CpEsBlHgDVEx@AhB@`ACRKXWNa@@]Co@Aq@Ea@PsFl@_WTiJJkAXqA^cAfDiHNu@Bm@K{@[_BCa@g@aCQg@kBuIoAiFcA{Ge@qD[_CiA}D_FkQ_BwG}AoHyE}UQaBEwEBgCAgJ?kO?uBLmSf@{Uh@cWx@_a@^oLAiCKsBs@qEqBaKgAuI{Eae@S}DCiK@uESeEyE{_@{Dk[aEu\\c@aEEqADaDMs@OYSQe@Sm@CqAPsAXaCVaIr@mJt@cD\\{ANuABiBe@sAi@cBy@iCkA}MkGag@gUea@cRiCiA?]qAqA]w@WeAIu@?e@FmADw@Go@Qe@iAgC{E}JCIG@A?c@k@SGIFK\\`BfDr@hANb@@hFGbAc@nAc@|@YdADn@Zf@xFnCd@\\dAn@d@VXJSj@"
            },
            "summary": "Av Chapultepec",
            "warnings": [],
            "waypoint_order": [
                0,
                1,
                2
            ]
        }
    ],
    "status": "OK"
}
```

 I’ve added the response file due to the big size of file.

[Click here to download response json.](/static/images/blogs/web/radar-vs-google-maps/google_directions_api_response.json "Google Directions API Response")

Above file contains the Google’s Direction API’s response for above provided request payload.

---

### **Radar**

Radar’s Directions API request typically follows the format of a URL with specific parameters. Here is a general structure of how a request might look:

```jsx
curl "https://api.radar.io/v1/route/directions?parameters" \
-H "Authorization: {RADAR_PUBLISHABLE_CLIENT_KEY}"
```

Here also, `parameters` are divided into two groups Required & Optional:

Required Parameters:

- `locations` - List of coordinates to visit in order .You can supply locations separated by the pipe character (|), in the form of latitude/longitude coordinates

Optional Parameters:

- `units` -  The distance units. A string, `metric` or `imperial`. Defaults to `imperial` if not provided.

In my use case I was only using above optional parameters but if you want to learn about remaining optional parameters, you can refer [here](A list of up to 25 coordinates to visit in order. A pipe-delimited string in the format).

**Sample Radar Request**

```jsx
curl "https://api.radar.io/v1/route/directions?locations=19.434069858962054,-99.12508165077894|19.42717,-99.1609062|19.4713369,-99.1883185|19.4248097,-99.19492559999999|19.4332743,-99.0894663&units=metric" \
-H "Authorization: {RADAR_PUBLISHABLE_CLIENT_KEY}"
```

**Sample Radar Response:**

Radar provides response in `JSON` format which looks like this: Let’s see how the `json` response looks like:

```jsx
{
    "meta": {
        "code": 200
    },
    "routes": [
        {
            "duration": {
                "value": 50.74661166666667,
                "text": "51 mins"
            },
            "distance": {
                "value": 42095,
                "text": "42.1 km"
            },
            "legs": [
                {
                    "startLocation": {
                        "latitude": 19.434069,
                        "longitude": -99.125081
                    },
                    "endLocation": {
                        "latitude": 19.42717,
                        "longitude": -99.160906
                    },
                    "duration": {
                        "value": 7.776376666666667,
                        "text": "8 mins"
                    },
                    "distance": {
                        "value": 5038,
                        "text": "5.0 km"
                    },
                    "geometry": {
                        "polyline": "}`dad@~tba|D@KpDkm@nZrCvi@bEbs@|Ffj@nExYnCf_A|Hpf@bEb]jC`WnB|h@bE|t@xF~Hl@pDXxx@jGgDfb@sEji@oJphAoHjr@eBtX{Bva@M|BSzCQfE?dDPpDZ`Ft@tE`A`Dd@xA|GrPlGnLt@dCf@jCZlCJhC@fCKhC}EfkA]dI_@fJ}EtlAiDj{@yAv`@aAjVkEjgA{G`aB}An_@sI~uBa@zBaDlIkBxGqA~Gi@vFQdBMpCCxDHzGf@zI?lD[hWo@xO{Bth@oAlWc@dJsHnaBSjEKtCiChdAIbCiBvq@?tBPlCp@nFxCtPDVr@|D\\pBTlAd@`BfArHv\\doBh`@`~BrDzTxDzTxFl_@~Lvy@pBzMzNhdAjLxw@rTn}AhBdNtBr[pDfa@{YhL{v@xZmu@x\\eMe]"
                    }
                },
                {
                    "startLocation": {
                        "latitude": 19.42717,
                        "longitude": -99.160906
                    },
                    "endLocation": {
                        "latitude": 19.471336,
                        "longitude": -99.188318
                    },
                    "duration": {
                        "value": 12.131350000000001,
                        "text": "12 mins"
                    },
                    "distance": {
                        "value": 9288,
                        "text": "9.3 km"
                    },
                    "geometry": {
                        "polyline": "_hv`d@tlhc|DyOyb@_w@~\\eKbE}MyEmu@yWgLaEuQ}GkHoCsKoEmSyI_EcBoC{FsBeLy@{Ge@uGiCwH{DyH_KoM_FwJoBcFoBoFgd@unAqk@y}A_A_He@kGe@wFgB_JqBaG{C}EmDqD}EiFwGbJZjF|@bInAbGxB|EfCtDhIvIrF~E~j@|}Ajf@`qA~ClIhBtFpAlGbCvQ`CvIlDxHtCrDtD|FpDjGzFzNhGnOhWns@dT`j@l^hcAhThl@~BqA`Ba@lCYlBChEr@pDnBpBxBbAjBl@dCZxEa@xE}AbEmC~CwAz@}Al@`DxIlVrp@|c@vpApZby@}@l@iD`EaC`H]`I^bCyCfGmHlFmDnAk\\fO{EpBsS`JwkAvf@kgAld@iR~H_uAtk@o\\vM_IvGyFtEkE|ImBrGcAbIBdIj@vHlKpl@lPf_Ao@vEs@~B{ApCoGvIwDfFqPrYcRf\\uOnY}AxDm@xAQb@kJjUu@pB{I~TaAfCqDvJeIxSmPvb@cK~WwDvJcDnI_KpWePn`@eAlCoGbPs@fBsE`L}GrPwAhDsE`LgQdr@yBvIqBrGgA|CmIdJub@`h@kA|@{AbAmAl@wA`@cB^yB\\eBL}AB_G?kD?qAD}@LyAXmA\\yAh@kAj@eAt@{@|@q@x@q@rAm@tAgJlWc@hAi@bAq@jAcAvAcAjAwBnBuSmBaGc@}vAuKeTaBkF_@kxBoQmJm@a{AaLeNkA{XmCyCSwBYsCMkh@}Cch@yCkE_@w`@wBeP{AqF|Ew~@ps@yEtDmjAv}@y_@hZePnMsQvNiOlL}u@jl@uB`BuC~Bo@b@uErDgq@rh@sQhNsB|A_ZvVuNfMoA~@uCjCcDtCoCpBkDbCgDfBwB~@sC|@cCr@eHzAwl@tLkfBb`@uyAvZ_TxF}Y|Fc\\vEgm@lDi_@Vcc@cAmfA{EskA}EmkBqHec@cBizAqFymBoIme@sBau@iDuQeH}FUtCk^|P_JtYhA~@Bb^tA"
                    }
                },
                {
                    "startLocation": {
                        "latitude": 19.471336,
                        "longitude": -99.188318
                    },
                    "endLocation": {
                        "latitude": 19.424809,
                        "longitude": -99.194925
                    },
                    "duration": {
                        "value": 12.149298333333332,
                        "text": "12 mins"
                    },
                    "distance": {
                        "value": 10079,
                        "text": "10.1 km"
                    },
                    "geometry": {
                        "polyline": "k~lcd@do~d|DpI\\duAzDgQrk@cC|HmCtIvNr@|a@nBr`@jBph@lBhU`ApXhA`Pt@xoAhF|T|@bQeDdFRteAbEpfAjExP|@|QVb]Izp@iEnGo@`Hw@lKiBxViFzDy@ptBwe@f}Am[zb@iJb_@_K~BgA~EeCrE_DpUyQlTeObHuEdf@w`@lQaOxXoR|FuDpt@ol@bG{EtYoVldAsw@la@a[nToP|M{Jju@mk@bMqJ`n@jEnzAfLxE^hVbB~`@~B|ZbCl`@|CzBPlGf@rIv@nIj@zQnAh{AbKrsBdP~Fb@vGn@fKhAjT`ExGlBzE~AnBz@vDxBdNdJh]d_@zCdJp@tIs@bb@m@|OMtHMnHg@lc@y@tm@k@p`@CrCvBvMGnOp@tQ_Adl@eBlr@q@rs@q@jr@}B~dBiB|~@{@~d@OjIiAnk@{DvnBgBzKyAfs@aAtk@{Adw@e@tXa@`ZQjOy@vf@aAng@i@l[QrNIpGk@ld@u@ti@k@jYo@~`@_CjxAg@db@oC`mBbB`NEzAa@nS]dTe@rn@MvJ{@n_@CrAGrGyAzw@SfL[tKTnG]hEk@dEq@`D}@zCs@xChLyErBu@hMkE|IoCrJuCbImDtUqInLgE`FiBjHkClMuEfFsBdFyBhGwCbG_DdRgKjIaF`IoFhF_EbFgEnBqChBuCbD{FbEuDtj@em@lSoVzJwMbZs`@rLgPrFqJrCcH|CiJlEoOpB{GhBmFbBkDdCmDxAuB`BkBtBkBnDkCtC_BtEwBlE_BvHyBfNgE|CuAnDkB~AyAxDkD~D_F|CgFbCkFpDiIbBaE|AkDbBeC~PuWzBiDnPiVnGaJzT_\\tNgShSkY`O_TvNqSpDoEpDyDvJqJhEcE~IwIjA{AlASvAc@fCaApDeB~CmAhB]vHcAzOmBvAa@vBcAlBcBlAyAz@aBdBqDfA{CrBeHv@iEh@}DhAyQLeCLgAb@wBCo@]wEg@uE}DgUg@cEUiEA_DDgDNiDtEek@NiBd@wEJiAxCq_@jHs}@tAgP^oEZ{DrF}o@^iE|KitA\\qEbE{EvTqU`x@zH"
                    }
                },
                {
                    "startLocation": {
                        "latitude": 19.424809,
                        "longitude": -99.194925
                    },
                    "endLocation": {
                        "latitude": 19.433274,
                        "longitude": -99.089466
                    },
                    "duration": {
                        "value": 18.68958666666667,
                        "text": "19 mins"
                    },
                    "distance": {
                        "value": 17690,
                        "text": "17.7 km"
                    },
                    "geometry": {
                        "polyline": "uhr`d@vole|Dax@{H}E_I`Mu|AsI}[lCo\\fD_b@xAgPVeD^kEzDmf@fEuh@N}Az@{K`ByR`Sa`CrAyOZuEfByTdS{aCbA}LxAkPxWedDdLmqAz@gLh@cH~Cy_@fJ}jA|Caf@bFys@jDga@fAyMb@cFbAcTMuIg@}EcB_LoB}JiBsEoVaq@yf@esAy]aaAuCvAmANqBR_Ea@iDcBs@}@kA{AgAsDE_BGaBl@{D`BcDfA_AdA{@bCs@g^w`Ayf@wtAuXst@yBhAsBh@yB\\yGEgGaBmEgD_HWiK`AmDnAk\\fO{EpBsS`JwkAvf@kgAld@iR~HyGs@}n@tWqs@pZwAj@_[`Mm@Rg@Li@Jk@Da@Bg@A_BGqMoHke@_WwKcGcOmIeEa@}Cw@uBo@oEuAeDkAqENo]}R{YgPqsA_u@wDsBoEiBkOeGqiDcpAk`A}^iMiFsLmF{p@o\\}G{CmM_FkNuCccAmMubAuNsF{@iT{CujEsn@kJg@aJE{uA@}EMsO]ge@}AaY{A_`A}FgGe@g~@sH{l@_Fc`D_b@cRaDaI}BwF{BaGuCiH{DgJuHgIwJuUgYkq@o|@yPeMuDuB}Z}Mi|@_a@aNsHwGsDwF}DcJmIcIcKiMuTcF{PuBaJuBaPcAgQXeT~AoT~CwXrEkZ|EmXzFgg@|TwxBxEiu@pBcZ|G_jABkLYcLyBeToAkJ{Hof@eB}KuUuyAgEk_@[kKqCoRiD}LcCuFkBmFeAaEsK{k@}EyNyBeL_Hg]{@_JLeJrB}KbFkLhJgHxKcFzHoDzCuC`CgDhA{DbA_FViGSyHaBuIsA}BoCcFiDyDkYcQmDqBya@g[}CoDmBuEuAcIYcFQac@Ek\\v@g~@lEcfD|@oz@r@ca@RuNDuKRkIX_Ip@kI~@yHpAkHxA_FzBoHxCgHnFsK`\\gn@bb@ky@xXil@dQu\\`I}NpGwLjFaKlL}TpN{YdIwO~CqHpEsLnIsU`EoQrH_\\jGgWvZsqAfNer@ba@mdBpG}Y`Laf@jYgrAlE_QpEcRlDcMrHqYrBoIzAcG~EiSvHy\\xAyF|E{NxGmN~FuJnGiJzS_XrUm[jYy_@`W_\\hb@ye@~JeLlFkHt\\wb@nIkLdHuJ`JaMnP}XhKcQxDkH~D{LxDoNr@oCjA_Ghi@ctBzQqq@dj@osBfG_OvEwQtH{YpQmr@vH_ZjCeKf`@ezA|@sIdSov@tD{OxB{NzAmN\\aOAgOk@uOgCaSyFyY_n@y_Cm@aKoGeUqMyd@eGeToOaj@sCsGkBqIsAoKu@kHO_HCkL`@wKz@wMdBgJfCmJtCcJ|DsIfIyMjPwRtc@we@tOiPdT{UzNePfk@mm@lTmU`I_J~OcQrfAyjAzGoGtEiEnGyFfIkF`HaEnD_BxSwHtIuCjt@wVvVyIvLiEt`A{\\v@YpWeJnF_Et^yL~IuBpHkAhGo@`Jq@pIKtJDvM`AhC\\~C`@`LfBj`@xKnZjI|N~D|KjCfNnC|_B|QjFbF`D`@xAPri@|G~IbBfAZfBt@lBdAxApAvA|At@dBp@hBZzATbBPfBZ|BbBvL\\~Al@nBhA|BrArBjBrBvBdB`CtAzOtHdDpBta@zRtIxDnRnJlE|BnLdF|HvDjLbF_GxO"
                    }
                }
            ]
        }
    ]
}
```

**Comparison**

Now, we will talk about the similarities and differences between Radar’s & Google Directions API respectively:

**Similarities**:

- Integration of both the API seems very easy and does not required any special challenge.
- The response time of both the APIs are quite similar.

**Diffrences**

| Google Directions API | Radar Directions API |
| --- | --- |
| Google APIs use separate parameters for origins and destinations. waypoints are specified as a set of latitude-longitude pairs separated by the pipe symbol | to indicate the locations between the specified origin and destination. The API then processes this information to provide directions. | Radar, on the other hand, accepts a list of latitude-longitude pairs separated by the pipe character (|). This list denotes specific geographic locations, allowing Radar to process and utilise this information accordingly. |
| Google provides the flexibility of using a variety of optional parameters to enhance the precision and customisation of results, allowing users to tailor their queries for more accurate outcomes. | In contrast, Radar offers a limited set of optional parameters for filtering results. The available options are more constrained compared to Google's extensive set of parameters, providing users with fewer customisation choices. |
| Google has the capability to furnish results that take into account both current live traffic conditions and future traffic predictions if users specify their arrival or departure time. The service can provide estimated durations for routes under both typical and congested traffic scenarios. | In contrast, Radar lacks the capability to offer results considering live or future traffic conditions based on specified arrival or departure times. The service does not provide estimated durations accounting for traffic variations. |
| In its results, Google offers route steps that include HTML instructions, polyline points for individual steps, duration information for each step, and other details. This makes Google's response content rich, providing comprehensive information for users. | In contrast, Radar does not furnish detailed directions or step-wise polyline information. Instead, it provides a single overview polyline representing the entire route without the granularity of individual steps. |

---

### **Pricing**

The Radar’s official site provides a very details comparison of Google and Radar’s Pricing. Here are the articles of few links which can be used to compare pricing:
- [Radar Vs Google Price Comparison](https://radar.com/content/alternatives/google-maps-api-vs-radar) 
- [Google Maps API Cost](https://radar.com/blog/google-maps-api-cost)

These articles can be helpful in comparing the pricing plans of Google and Radar.

## **Conclusion**

In conclusion, as a software engineer, the initial inclination is often towards well-established names like Google Maps and Twilio for various services. However, over time, the cost implications of using extensive features provided by these services may become apparent. In my case, although Google Maps offered a plethora of features, I realised that my use case was limited to just two APIs - Route Matrix and Directions.

The comparison outlined above highlights that while Google Maps provides superior options and content-rich responses, it may be more than what is needed for smaller applications. This led me to explore alternatives, and Radar emerged as a cost-effective solution that efficiently caters to my specific requirements.

The key realisation is that for smaller applications, which utilise only a subset of map-related services, Radar proves to be a viable choice due to its affordability. The conclusion drawn from the comparison is that Radar performs the required tasks effectively with lower charges. However, if the application expands and requires features beyond Radar's capabilities, integrating Google Maps as a secondary option becomes a strategic approach. This way, the system primarily utilizes Radar, falling back on Google Maps only when necessary, thereby optimizing costs without compromising on feature quality.
