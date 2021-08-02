# PatronTrends (patrontrends)

This is a quick and dirty side project by the folks behind [Lansing Makers Network's Patronicity campaign](https://www.patronicity.com/project/lansing_makers_network_make_the_move#!/). We use the APIs powering the Patronicity site to show you information about a campaign.

This site is hosted on the free tier of [Netlify](https://netlify.com/) at https://patrontrends.netlify.app. If you're into Jamstack stuff, you should absolutely show Netlify some love and see what they have to offer. If you find this site useful, feel free to consider supporting [our campaign](https://www.patronicity.com/project/lansing_makers_network_make_the_move#!/). We'll keep the application up and running as long as it doesn't cost us anything. 😁

**IMPORTANT: This project is not maintained, endorsed or supported by Patronicity. Please don't pester their support with questions. The analysis done by the application is our naive attempt at interpreting the available data. If you notice a discrepency assume its our fault, not Patronicity's. For campaigns: your campaign is your business—make your strategic decisions with your own data analysis, not ours (no matter how awesome we seem). For supporters: take these analyses with a grain of salt. We're not statisticians.**

## Application
The application is a Quasar 2.x application using Netlify serverless functions to fetch data from the Patronicity APIs.  These are not public APIs, but rather the APIs the Patronicity website uses to render the page, so they could change at any time, without notice. 

## Development
### Install Netlify-cli
`npm i -g netlify-cli`

### Install application deps
`yarn install`

### Start the netlify dev server
`netlify dev`

## Deployment 
The Netlify site deploys automatically on push to master.  For a manual deploy run: `netlify deploy`
