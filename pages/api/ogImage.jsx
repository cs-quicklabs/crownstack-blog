import { ImageResponse } from '@vercel/og'
import React from 'react'
import Image from 'next/image'

export const config = {
  runtime: 'experimental-edge',
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
      cover && `${protocol}//${host}/_next/image?url=${encodeURIComponent(cover)}&w=1200&q=75`
    const imageResponse = new ImageResponse(
      (
        <div tw="w-full h-full flex flex-col justify-end items-stretch bg-white">
          {coverUrl && (
            <img
              src={coverUrl}
              alt="Crownstack Logo"
              tw="mx-auto my-auto h-full w-full bg-white flex-1"
              style={{ objectFit: 'contain', objectPosition: 'center', background: 'white' }}
            />
          )}
          <div tw="bg-white flex-1 flex">
            <div tw="flex flex-col mx-8 my-auto">
              <div tw="text-5xl mb-2">{title}</div>
              <div tw="text-3xl">
                {author + ' – ' + new Date(date).toLocaleDateString('en-US', { dateStyle: 'long' })}
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 628 }
    )
    return imageResponse
  } catch (error) {
    console.error(error)
    return res.status(500).end('Internal Server Error')
  }
}
