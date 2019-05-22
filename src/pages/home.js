import React, { Component } from 'react'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const accessToken =
  "dc2eb2f0153072d1a478658f7599cfaa0477632bc7ba981510b9bb703efb7d9f";
const spaceId = "f7lhvowaprbt";
const query = `
{
  newsCollection(limit: 1) {
    items {
      sys {
        id
      }
      titel
      ort
      datum
      beschreibung
      product
      productFamily
      ricHText {
        json
      }
    }
  }
}
`;

class Home extends Component {

  constructor() {
    super();

    this.state = {
      result: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    fetch(
      `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/master`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          query
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        console.log(response);

        const { data } = response;
        this.setState({
          loading: false,
          result: data ? data.newsCollection : []
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message
        });
      });
  }

  render() {
    if (this.state.loading) {
      return "loading";
    }

    if (this.state.error) {
      return this.state.error;
    }

    if (!this.state.result) {
      return "no data defined";
    }

    const { items } = this.state.result;
    console.table(items);

    return (
      <div className="App">
        {items.map((item) => {
          const richText = item.ricHText.json;
          documentToReactComponents(richText);
          console.log(richText);
          return(
            <>
              <h1>{item.titel}</h1>
              <p>{item.ort}</p>
              <p>{item.datum}</p>
              <p>{item.beschreibung}</p>
              <p>{item.product}</p>
              <p>{item.productFamily}</p>
              <p>{documentToReactComponents(richText)}</p>
            </>
          )
        })}
      </div>
    );
  }
}

export default Home
