//
/* eslint-env node */
const fetch = require("node-fetch")

const URL = "https://www.patronicity.com/"
const defaultOpts = {}

exports.handler = async function (event) {
  const slug = event.queryStringParameters.slug
  if (!slug) {
    return {
      statusCode: 404,
    }
  }
  try {
    let response = await fetch(`${URL}project/${slug}#!/`)
    const cookies = parseCookies(response)
    Object.assign(defaultOpts, {
      headers: {
        "x-xsrf-token": cookies.get("XSRF-TOKEN"),
        cookie: cookiesToHeader(cookies),
        "Content-Type": "application/json",
      },
    })

    const project = await fetchApi("view", { slug })

    return {
      statusCode: 200,
      body: JSON.stringify(project),
    }
  } catch (error) {
    return errorResponse({ error })
  }
}

function parseCookies(response) {
  const raw = response.headers.raw()["set-cookie"]
  const cookies = new Map()
  raw.forEach((c) => {
    const parts = c.split(";")
    const cookiePart = parts[0].split("=")
    cookies.set(cookiePart[0], cookiePart[1])
  })

  return cookies
}

async function fetchApi(endpoint, data) {
  const response = await fetch(`${URL}/api/projectapi/${endpoint}`, {
    ...defaultOpts,
    method: "POST",
    body: JSON.stringify(data),
  })

  return (await response.json()).result
}

function cookiesToHeader(cookies) {
  const cArray = []
  for (const [key, value] of cookies) {
    cArray.push(`${key}=${value}`)
  }
  return cArray.join(";")
}
function errorResponse(context) {
  return {
    statusCode: 500,
    body: JSON.stringify(context),
  }
}

// function log(context) {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ context }),
//   }
// }
