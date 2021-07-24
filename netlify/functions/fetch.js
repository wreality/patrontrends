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

  const cookies = parseCookies(response)
  const defaultOpts = {
    headers: {
      "x-xsrf-token": cookies.get("XSRF-TOKEN"),
      cookie: cookiesToHeader(cookies),
      "Content-Type": "application/json",
    },
  }

  try {
    response = await fetch(`${URL}/api/projectapi/view`, {
      ...defaultOpts,
      method: "POST",
      body: JSON.stringify({ slug }),
    })
  } catch {
    return errorResponse({ error: "Unable to find project id" })
  }
  let json = await response.json()
  const project = json.result
  const id = project.ID

  try {
    response = await fetch(`${URL}/api/projectapi/statsPanel`, {
      ...defaultOpts,
      method: "POST",
      body: JSON.stringify({ id }),
    })
  } catch (e) {
    return errorResponse({ error: e.message })
  }
  json = await response.json()
  Object.assign(project, json.result)

  try {
    response = await fetch(`${URL}/api/projectapi/timeline`, {
      ...defaultOpts,
      method: "POST",
      body: JSON.stringify({ slug }),
    })
  } catch {
    return errorResponse({ error: "Unable to fetch timeline" })
  }
  json = await response.json()

  project.timeline = { ...json.result.items }
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
