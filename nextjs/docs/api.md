### API Specification for Card Search and Catalog APIs

This API spec is designed to align with the existing functionality described in the Star Wars Unlimited Database API.

---

### **Base URL**
- **Development**: `/api`
- **Production**: `https://api.swu-db.com`

---

### **Endpoints**

#### 1. **Get Catalog Options**
Retrieve available HP options for the dropdown.

- **Endpoint**: `/catalog`
- **Method**: `GET`
- **Description**: Fetches all available HP values for filtering.
- **Response**:
    - **200 OK**:
      ```json
      {
        "object": "catalog",
        "uri": "https://api.swu-db.com/catalog/hps",
        "total_values": 20,
        "data": ["0", "+0", "+1", "1", "+2", "2", "+3", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "25", "26", "30"]
      }
      ```
    - **400 Bad Request**: Invalid parameters.
    - **500 Internal Server Error**: Unexpected issues.
- **Usage**:
    - Used by `Dropdown.tsx` to populate filter options.

---

#### 2. **Search for Cards**
Search for cards based on HP and other query parameters.

- **Endpoint**: `/search`
- **Method**: `GET`
- **Query Parameters**:
    - `hp`: Filter cards by their HP value (e.g., `5`).
    - `q`: Optional, additional search filters (encoded query string).
    - `pretty`: Optional, `true` to format JSON response for readability.
- **Example Request**:
  ```
  GET /search?hp=5&pretty=true
  ```
- **Description**: Fetches a list of cards matching the specified criteria.
- **Response**:
    - **200 OK**:
      ```json
      {
        "total_cards": 67,
        "data": [
          {
            "Set": "TWI",
            "Number": "096",
            "Name": "Aayla Secura",
            "Subtitle": "Master of the Blade",
            "Type": "Unit",
            "Aspects": ["Command", "Heroism"],
            "Traits": ["FORCE", "JEDI", "REPUBLIC"],
            "Arenas": ["Ground"],
            "Cost": "5",
            "Power": "6",
            "HP": "5",
            "FrontText": "Coordinate — On Attack: Prevent all combat damage that would be dealt to this unit for this attack.",
            "DoubleSided": false,
            "Rarity": "Legendary",
            "Unique": true,
            "Keywords": ["Coordinate"],
            "Artist": "Tatsiana Maksimuk",
            "VariantType": "Normal",
            "MarketPrice": "15.38",
            "FoilPrice": "16.76",
            "FrontArt": "https://cdn.swu-db.com/images/cards/TWI/096.png",
            "LowFoilPrice": "16.43",
            "LowPrice": "14.90"
          }
        ]
      }
      ```
    - **400 Bad Request**: Invalid parameters.
    - **500 Internal Server Error**: Unexpected issues.
- **Usage**:
    - Used by `CardList.tsx` to fetch and display cards.

---

### **Data Model**

#### Card Object
- **Properties**:
    - `Set`: The set code of the card (e.g., `"TWI"`).
    - `Number`: Unique number within the set.
    - `Name`: Name of the card.
    - `Subtitle`: Subtitle or additional name detail.
    - `Type`: Card type (e.g., `"Unit"`).
    - `Aspects`: Array of aspects associated with the card.
    - `Traits`: Array of traits associated with the card.
    - `Arenas`: Array of arenas the card can participate in.
    - `Cost`: Cost to play the card.
    - `Power`: Card's power.
    - `HP`: Card's health points.
    - `FrontText`: Description or effect text on the card.
    - `DoubleSided`: Boolean indicating if the card is double-sided.
    - `Rarity`: Card rarity (e.g., `"Legendary"`).
    - `Unique`: Boolean indicating if the card is unique.
    - `Keywords`: Array of keywords associated with the card.
    - `Artist`: Name of the artist.
    - `VariantType`: Type of variant (e.g., `"Normal"`).
    - `MarketPrice`: Current market price.
    - `FoilPrice`: Price for the foil version.
    - `FrontArt`: URL of the card's artwork.
    - `LowFoilPrice`: Lowest price for the foil version.
    - `LowPrice`: Lowest market price.

---

### Suggested Improvements
1. **Error Handling**:
    - Add more specific error codes and messages for common client-side issues.
2. **Pagination**:
    - Support `limit` and `offset` parameters for `/search` to handle large datasets.
3. **Caching**:
    - Implement server-side caching for frequently requested data (e.g., dropdown options).
