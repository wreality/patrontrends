//
/* eslint-env node */
const fetch = require("node-fetch")

const URL = "https://www.patronicity.com/"

exports.handler = async function (event) {
  const slug = event.queryStringParameters.slug
  if (!slug) {
    return {
      statusCode: 404,
    }
  }

  let response
  try {
    response = await fetch(`${URL}project/${slug}#!/`)
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }
  }

  const text = await response.text()
  const projectId = text.match(/project-id="([0-9]+)"/)[1]
  const cookies = parseCookies(response)

  try {
    response = await fetch(`${URL}/api/projectapi/statsPanel`, {
      method: "POST",
      headers: {
        "x-xsrf-token": cookies.get("XSRF-TOKEN"),
        cookie: cookiesToHeader(cookies),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: projectId }),
    })
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }
  }

  const project = await response.json()

  return {
    statusCode: 200,
    body: JSON.stringify(project),
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

function cookiesToHeader(cookies) {
  const cArray = []
  for (const [key, value] of cookies) {
    cArray.push(`${key}=${value}`)
  }
  return cArray.join(";")
}

// function log(context) {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ context }),
//   }
// }
