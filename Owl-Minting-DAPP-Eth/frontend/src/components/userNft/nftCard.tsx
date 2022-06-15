import React from "react";
import { NftCards, CardType, CardTypeText, CardTypeValue } from "./element";
import { Card } from "react-bootstrap";
import cardImage from "assets/images/cop_owl.png";

interface Props {
  item: any;
}

const NftCard: React.FC<Props> = ({ item }: { item: any }) => {
  const type = JSON.parse(item?.attributes).find(
    (x) => x.trait_type === "Owl Type"
  );
  return (
    <>
      <NftCards>
        <Card.Img variant="top" src={cardImage} className="p-2" />
        <Card.Body>
          <Card.Title className="text-center">
            {item.name} {item.token_id}
          </Card.Title>
          <Card.Text>
            <CardType>
              <CardTypeText>Owl Type</CardTypeText>
              <CardTypeValue>{type?.value}</CardTypeValue>
            </CardType>
          </Card.Text>
        </Card.Body>
      </NftCards>
    </>
  );
};

export default NftCard;
