import { ImageResponse } from '@vercel/og'
import React from 'react'

export const config = {
  runtime: 'edge',
}

export default function handler(req, res) {
  try {
    const url = decodeURIComponent(req?.url || '', 'http://localhost') // Provide a base URL if needed
    const { searchParams, protocol, host } = new URL(url)
    const title = searchParams?.get('title') || 'No title'
    const author = searchParams?.get('author') || 'Anonymous'
    const date = searchParams?.get('date') || '2022-11-08T12:00:00.000Z'
    const cover = searchParams?.get('cover')
    const coverUrl =
      cover && `${protocol}/${host}/_next/image?url=${encodeURIComponent(cover)}&w=1200&q=75`
    const imageResponse = new ImageResponse(
      (
        <div tw="w-full h-full flex flex-col justify-end bg-white items-stretch ">
          {coverUrl && (
            <div tw="flex-1 flex px-16 items-end">
              <img
                src={coverUrl}
                alt="Crownstack Logo"
                tw="h-28"
                style={{ objectFit: '', objectPosition: 'left' }}
              />
            </div>
          )}
          <div tw="bg-white flex-1 flex px-20">
            <div tw="flex flex-col my-auto">
              <div tw="mb-6 text-6xl font-bold">{title}</div>

              <div tw="text-4xl">
                {author + ' – ' + new Date(date).toLocaleDateString('en-US', { dateStyle: 'long' })}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
    return imageResponse
  } catch (error) {
    console.error(error)
    return res.status(500).end('Internal Server Error')
  }
}
