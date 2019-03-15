let Card = function(_rank, _suit)
{
    this.rank = _rank;
    this.suit = _suit;
    switch (this.rank) //Assign name
    {
        case 1:
            this.name = "Ace";
            break;
        case 2:
            this.name = "Two";
            break;
        case 3:
            this.name = "Three";
            break;
        case 4:
            this.name = "Four";
            break;
        case 5:
            this.name = "Five";
            break;
        case 6:
            this.name = "Six";
            break;
        case 7:
            this.name = "Seven";
            break;
        case 8:
            this.name = "Eight";
            break;
        case 9:
            this.name = "Nine";
            break;
        case 10:
            this.name = "Ten";
            break;
        case 11:
            this.name = "Jack";
            break;
        case 12:
            this.name = "Queen";
            break;
        case 13:
            this.name = "King";
            break;
        default:
            this.name = "Unknown";
    }
    switch(this.rank) //Assign # of points the card is worth at the end of the game
    {
        case 8:
            this.points = 10;
            break;
        case 2:
        case 11:
            this.points = 5;
            break;
        default:
            this.points = 1;
    }
    this.getImg = function(_pseudo = true)
    {
        return "images/cards/" + (this.faceUp?
            (((_pseudo)?this.pseudoSuit:this.suit) + this.rank)
            :"backRed") + ".png"; //If not faceUp, use backRed.png
    };
    this.title = this.name + " of " + this.suit;
    this.faceUp = false; //This property determines whether the card's image is the back or front
    this.flip = function()
    {
        this.faceUp = !this.faceUp;
    };
    this.pseudoSuit = _suit; //Used for when the 8 changes the suit. This is what is checked against the suit of a to-be-played card.
};
let CardDeck = function(setOnCreate = true)
{
    this.cards = [];
    this.setCards = function() //Adds every card to the cards array
    {
        for (let i = 0; i < SUITS.length; i++)
            for (let k = 1; k <= 13; k++)
                this.cards.push(new Card(k, SUITS[i]));
    };
    if (setOnCreate)
        this.setCards();
    this.shuffle = function()
    {
        //"It is commonly believed that 7 to 12 shuffles are required on a
        //'new deck order' deck of cards for them to be thoroughly shuffled."
        let numOfShuffles = Math.floor(Math.random() * 5) + 7; //Random number between 7 and 12
        for (let k = 0; k < numOfShuffles; k++)
        {
            for (let i = this.cards.length - 1; i >= 0; i--)
            {
                let rand = Math.floor(Math.random() * (i + 1)); //Investigate what happens when Math.round/ciel is used. Leads to 2nd to last card being undefined when unplayedDeck is restocked.
                let temp = this.cards[i];
                this.cards[i] = this.cards[rand];
                this.cards[rand] = temp;
            }
        }
    };

    this.compareSuit = function(a, b) //Used for sorting a deck
    {
        let order = 0;
        if (SUITS.indexOf(a.suit) > SUITS.indexOf(b.suit))
            order = 1;
        else if (SUITS.indexOf(a.suit) < SUITS.indexOf(b.suit))
            order = -1;
        else //If suit is equal
        if (a.rank > b.rank)
            order = 1;
        else if (a.rank < b.rank)
            order = -1;
        return order;
    };
    this.compareRank = function(a, b) //Used for sorting a deck
    {
        let order = 0;
        if (a.rank > b.rank)
            order = 1;
        else if (a.rank < b.rank)
            order = -1;
        else //If rank is equal
        if (SUITS.indexOf(a.suit) > SUITS.indexOf(b.suit))
            order = 1;
        else if (SUITS.indexOf(a.suit) < SUITS.indexOf(b.suit))
            order = -1;
        return order;
    };
    /**
     * Returns array of cards that are in the deck and belong to the specified suit.
     * _suit: 0 = Spades, 1: Clubs, 2: Hearts, 3: Diamonds
     * If out of bounds, excludes every suit (If _except is true, includes every suit)
     * _rank: Returned array will only have cards of this rank.
     * If negative, includes all cards EXCEPT the specifed rank. 0 for no exclusion
     * _except: If true, negates _suit and returns every card in the deck EXCEPT those belonging to the specifed suit.
     */
    this.getCardsOfSuit = function(_suit, _rank = 0, _except = false)
    {
        if (typeof(_suit) === "string") //Change to respective index in SUITS if _suit is string
        {
            _suit = SUITS.indexOf(_suit.charAt(0).toUpperCase() + _suit.substring(1));
        }
        if (_rank > 13)
        {
            _rank = 0; /*Prevents inclusive checking for out of bounds ranks.
            Not done for <-13 because it's exclusive anyway
            E.g. If -14 is entered, program will try to EXCLUDE anything with rank 14 and rank 14
            is not possible anyway.
            But if 14 is entered, it tries to INCLUDE 14, there are no rank 14 cards, therefore nothing will return
            I could have easily used Math.abs and prevented out of bounds positives too, but this way feels better
            */
        }
        //filter through cards and add cards that are the specified suit and are not/are the specifed rank
        return this.cards.filter(_card =>
        {
            return (_except ?_card.suit !== SUITS[_suit] //If _except, only add cards NOT part of _suit
                :_card.suit === SUITS[_suit]) && //Otherwise only add cards belonging to _suit
                ((_rank > 0)?_card.rank === _rank //If positive, exclude specified rank
                    :_card.rank !== _rank * -1); //If negative, only add cards with the rank
        }); //end filter function
    };
    /**
     * Returns array of cards that are in the deck and belong to the specified rank.
     * _rank: Returns every card in the deck with this rank.
     * If negative, returns every rank EXCEPT the one specified.
     * E.g. -8 will return every card EXCEPT those of rank 8.
     * _suit: Return an array with the specified rank and suit
     * Use out of bounds/negative argument to include all suits
     * 0 = Spades, 1 = Clubs, 2 = Hearts, 3 = Diamonds
     * _except: Negates _suit and returns an array with the specified rank and every suit EXCEPT the one specified.
     * Does not have any affect if suit is negative
     */
    this.getCardsOfRank = function(_rank, _suit = -1, _except = false)
    {
        if (_suit > 3) //Prevent any out of bounds checking, since the suit is only filtered if _suit is positive
            _suit = -1;
        return this.cards.filter(_card =>
        {
            return ((_rank > 0)? _card.rank === _rank //If positive, include only cards of specified rank
                : _card.rank !== _rank * -1) && //Otherwise exclude cards of specified rank
                ((_suit > -1)? //If _suit is positive, filter suits (Otherwise return true)
                    (_except? _card.suit !== SUITS[_suit] //If _except, exclude specified suit
                        : _card.suit === SUITS[_suit]) //Otherwise, only include specified suit
                    : true); //If _suit wasn't positive
        }); //end filter function
    };
    /*
     *Returns special cards based on their points (Non special cards have 1 point)
     *_special: Use false to return all non special cards
     */
    this.getSpecialCards = function(_special = true)
    {
        //Filter through every card and return array of those which (don't) have 1 point
        return this.cards.filter(_card => _special? _card.points !== 1: _card.points === 1);
    };
    this.reorderBySuit = function()
    {
        this.cards.sort(this.compareSuit);
    };
    this.reorderByRank = function()
    {
        this.cards.sort(this.compareRank);
    };
    /*
     *Reorders based on whether the card is special
     *_place: true = Specials are first in deck, false = Specials are last
     *_sOrder: How to organize the special cards. See below.
     *_nOrder: How to organize the non special cards. See below.
     *true = By suit, false = By rank
     */
    this.reorderByKind = function(_place = false, _sOrder = false, _nOrder = true)
    {
        let spec = this.getSpecialCards();
        let nonSpec = this.getSpecialCards(false);
        spec.sort( (_sOrder)? this.compareSuit : this.compareRank ); //Sort special cards by suit or rank
        nonSpec.sort( (_nOrder)? this.compareSuit : this.compareRank ); //Sort non special cards by suit or rank
        this.cards = (_place)? spec.concat(nonSpec): nonSpec.concat(spec); //Decide where to place special cards
    };
    this.getCardByTitle = function(_title)
    {
        return this.cards.find(_card => _card.title === _title);
    };
    this.removeCardByIndex = function(_index)
    {
        return this.cards.splice(_index, 1)[0];
    };
    this.removeCardByTitle = function(_title)
    {
        for (let i = 0; i < this.cards.length; i++)
            if (this.cards[i].title === _title)
                return this.cards.splice(i, 1)[0];
    };
};

let Player = function(_username, _money, _tbl, _type = "cpu") //Separate from User because computer will also need a player object
{
    this.name = _username;
    this.hand = new CardDeck(false);
    this.money = _money;
    this.table = _tbl;
    this.type = _type;
    this.win = function(_amount)
    {
        if (_amount >= 0) //No negatives
            this.money += _amount;
    };
    this.lose = function(_amount)
    {
        if (_amount >= 0) //No negatives
            this.money -= _amount;
    };
    this.tallyPoints = function()
    {
        let pts = 0;
        for (let i = 0; i < this.hand.cards.length; i++)
            pts += this.hand.cards[i].points;
        return pts;
    };
    this.pickUp = function(_num = 1)
    {
        let amount = Math.min(_num, this.table.unplayedDeck.cards.length); //ensures that no more is taken than available
        this.hand.cards = this.hand.cards.concat(this.table.unplayedDeck.cards.splice(0, amount));
        if (this === USER.player) //Turn user's cards face up
            this.hand.cards.forEach(card=>card.faceUp = true);
    };
    this.doCardsMatch = function(_object, _matchCard = this.table.currentCard) //Checks if card(s) in hand match the matching card
    {
        let matched = false;
        if (typeof(_object) === "object")
        {
            if (_object.constructor === Card) //Compare singular card
            {
                matched = (_object.rank === 8 || _object.rank === _matchCard.rank || _object.suit === _matchCard.pseudoSuit);
            }
            else if (_object.constructor === CardDeck) //Compare inputed deck
            {
                let i = 0;
                while (i < _object.cards.length && !matched)
                {
                    matched = _object.cards[i].rank === 8 || _object.cards[i].rank === _matchCard.rank ||
                        _object.cards[i].suit === _matchCard.pseudoSuit;
                    i++;
                }
            }
            else
            {
                console.log("Invalid type for _object");
            }
        }
        else
        {
            console.log("_object is not an object", _object);
        }
        return matched;
    };
    this.continueGame = function(_card)
    {
        if (typeof(_card) === "string") //If it wasn't this player's turn
        {
            if (_card === "wrongTurn")
                console.log(`It isn't ${this.name}'s turn.`);
            else
                console.log(`The ${_card} is invalid and could not be played. Choose another.`);
        }
        else if (this.hand.cards.length === 0) //Checks if a player won
        {
            let animationTime = CardAnimations.moveCardTo.time + 300;
            if (this.type === "cpu")
                animationTime += CardAnimations.flipOver.time;
            if (_card.pseudoSuit !== _card.suit) //This means an 8 was played and flipped
                animationTime += CardAnimations.flipOver.time;
            setTimeout(()=> this.table.gameWon(this), animationTime);
        }
        else //If the card is valid, proceed with normal play
        {
            this.table.stockCheckUnplayed(); //Make sure unplayedDeck has sufficient amount cards
            if (_card === undefined) //Checks player could not play a card
            {
                this.pickUp();
                console.log(this.name + " could not play, so they were forced to pick up a card!");
            }
            else //Only valid cards will reach here
            {
                if (_card.rank=== 2) //Next person picks up 2 cards if it was 2
                {
                    this.table.players[this.table.getNextPlayerIndex()].pickUp(2);
                    console.log(`${this.name} forced ${this.table.players[this.table.getNextPlayerIndex()].name} to pick up 2 cards from the deck!`);
                }
            }
            this.table.nextTurn();
            trackers.turns++;
            console.log(`It is now ${this.table.getCurrentPlayer().name}'s turn to play.`);
            if (this.table.sortAutomatically)
                this.hand.reorderByKind();
        }
    };
    this.playCard = function(_card)
    {
        let playedCard; //Will be undefined, "wrongTurn", a string, or a reference to a card.
        //playedCard is meant to be passed into continueGame, which checks for these values
        if (this.table.getCurrentPlayer() === this) //Check if it is this player's turn
        {
            if (typeof(_card) === "string" && this.hand.getCardByTitle(_card) !== undefined)
            {
                _card = this.hand.getCardByTitle(_card); //Assume argument is meant to be title
            }
            if (this.doCardsMatch(_card))
            {
                playedCard = _card;
                this.table.playedDeck.cards.push(this.hand.removeCardByTitle(_card.title));
                this.table.currentCard = this.table.playedDeck.cards[this.table.playedDeck.cards.length - 1];
                this.table.currentCard.faceUp = true;
                if (_card.rank === 8)
                {
                    trackers.eightsPlayed++;
                    if (this.type === "cpu")
                        this.autoChoosePseudoSuit(_card);
                    console.log(`${this.name} played the ${_card.title} and changed the suit to ${_card.pseudoSuit}.`);
                }
                else
                {
                    console.log(`${this.name} played the ${_card.title}.`);
                    if (_card.rank === 2) //Next person picks up 2 cards
                    {
                        trackers.twosPlayed++; //Create some sort of alert
                        //Doing alert here because pick ups are handled in continueGame function
                        //But all alerts should at least be handled within the same function
                    }
                    else if (_card.rank === 11) //Skip next person's turn if a Jack
                    {
                        trackers.jacksPlayed++; //Create some sort of alert
                        this.table.nextTurn();
                        console.log(this.table.getCurrentPlayer().name + "'s turn was skipped!");
                    }
                }
            }
            else if (_card !== undefined)
            {
                playedCard = _card.title;
            }
            else
            {
                playedCard = undefined;
            }
        }
        else
        {
            playedCard = "wrongTurn"; //Flag that it wasn't this player's turn
        }
        return playedCard;
    };
    this.autoChoosePseudoSuit = function(_card)
    {
        //Computer chooses 8's suit based on whichever suit it has most of in its hand
        let suitLengths = []; //suitLengths contains the # of cards of each suit ordered the same as SUITS
        for (let i = 0; i < SUITS.length; i++)
            suitLengths.push(this.hand.getCardsOfSuit(i, -8).length); //Exclude 8's because they can be used with any suit
        let longest = Math.max(suitLengths[0], suitLengths[1], suitLengths[2], suitLengths[3]);
        //Since the order of the lengths is respective to SUITS, the indexOf the longest length is
        //the same index of the longest suit.
        //It doesn't matter if 2 suits have the same amount of cards
        _card.pseudoSuit = SUITS[suitLengths.indexOf(longest)];
    };
    this.automatedPlay = function()
    {
        let played = false;
        let plr = this;
        let playedCard = undefined;
        /*
         *Attempts to play specified card/array of cards
         *_cards: Input an array of cards
         */
        let checkCards = function(_cards)
        {
            if(_cards.some(_obj =>  plr.doCardsMatch(_obj)))
            {
                playedCard = _cards.find(_obj => plr.doCardsMatch(_obj));
                plr.continueGame(plr.playCard(playedCard));
                played = true;
            }
            return played;
        };
        //Check every player's hand length
        for (let i = 0; i < this.table.players.length; i++)
        {
            //If the computer thinks that it has more 8's than the other player has cards,
            //It doesn't want to risk having too many eights before the player empties their
            //hand and ends the game. So it does the following...
            if (this.table.players[i].hand.cards.length <= this.hand.getCardsOfRank(8).length &&
                this.table.players[i] !== this) //No need to worry if the player is itself
            {
                trackers.danger++;
                console.log(`${this.name} thinks it's in danger of losing!`);
                if (this.table.getNextPlayerIndex() === i) //If the player is the next one
                {
                    //Checks to see if it can play a 2 to make the player pick up 2
                    if (!checkCards(this.hand.getCardsOfRank(2)))
                    {
                        //If 2's are not possible, try to skip the next person with a Jack
                        checkCards(this.hand.getCardsOfRank(11));
                    }
                }
                //If the winning player is not the next one,
                //or if Jacks were not possible,
                checkCards(this.hand.getCardsOfRank(8)); //Play 8's to avoid points
                //Non special cards are checked later anyway, so no need to check them in a certain order here
            }
        } //End Player hand length check
        //Below is normal play (When the computer doesn't think it's in danger)
        if (!played) //Try to get rid of special cards first to avoid points and put the nxt player at a disadvantage
        {
            if (this.table.players.length === 2)
            {
                //If the player count is 2, the computer gets to play again immediately if it plays a jack
                //This block of code serves to make the computer try to play multiple jacks + an additional card
                //Before letting the next person play.
                let jacks = this.hand.getCardsOfRank(11);
                let i = 0;
                //The following 2 while loops serve to make the computer play its jacks first.
                while (i < jacks.length && !played)
                {
                    //If there's more than 1 Jack and it's the only card of that suit, play it
                    if (this.hand.getCardsOfSuit(jacks[i].suit).length === 1 && jacks.length > 1)
                    {
                        checkCards([jacks[i]]);
                    }
                    i++;
                }
                i = 0;
                while (i < jacks.length && !played)
                {
                    //Assure that there's another playable card before playing a Jack (Same suit or jack)
                    if (this.hand.getCardsOfSuit(jacks[i].suit).length > 1 || jacks.length > 1)
                    {
                        checkCards([jacks[i]]);
                    }
                    i++;
                }
            }
        }
        //If there are no playable Twos/Jacks, try to play non special cards
        if (TABLE.previousRound.every(item=>item.rank !== 2)) //Check that not all previous cards were 2. Prevents infinite 2 playing
            checkCards(this.hand.getCardsOfRank(2));
        if (!played)
            checkCards(this.hand.getCardsOfRank(11));
        if (!played)
        {
            //Check if a non special card is playable. Save 8's for last as they can be used at anytime
            //Computer prioritizes choosing rank or suit based on how many of each it has
            //The less cards of a group it has, the higher priority that group is
            //If the 2 are the same, rank is prioritized
            let nonSpecial = new CardDeck(false);
            nonSpecial.cards = this.hand.getSpecialCards(false);
            if (nonSpecial.getCardsOfRank(this.table.currentCard.rank).length >
                nonSpecial.getCardsOfSuit(this.table.currentCard.pseudoSuit).length) //Compares # of same suit vs # of same rank
            {
                //If you can't play one of the same suit, try to play one of the same rank
                if (!checkCards(nonSpecial.getCardsOfSuit(this.table.currentCard.pseudoSuit)))
                {
                    checkCards(nonSpecial.getCardsOfRank(this.table.currentCard.rank));
                }
            }
            else //Prioritize Rank
            {
                //If you can't play one of the same rank, try to play one of the same suit
                if (!checkCards(nonSpecial.getCardsOfRank(this.table.currentCard.rank)))
                {
                    checkCards(nonSpecial.getCardsOfSuit(this.table.currentCard.pseudoSuit));
                }
            }
            if(!played) //If no other cards can be played, look for 8s
            {
                if(!checkCards(this.hand.getCardsOfRank(8)))
                {
                    this.continueGame(undefined); //If there's no card to play, directly input card as undefined
                }
            }
        }
        return playedCard;
    }; //automatedPlay()
};

let User = function(_fname, _lname, _user, _money, _phone, _postal, _lastVisit) //Meant to contain info from cookies/form. Info is displayed in header
{
    this.firstName = _fname;
    this.lastName = _lname;
    this.fullName = this.firstName + " " + this.lastName;
    this.username = _user;
    this.money = _money;
    this.phoneNumber = _phone;
    this.postalCode = _postal;
    this.lastVisit = _lastVisit;
    this.player = new Player(this.username, this.money);
    this.displayInHeader = function(_incrementMoney = false)
    {
        qs("#username").innerHTML = this.username;
        qs("#phoneNumber").innerHTML = this.phoneNumber;
        qs("#postalCode").innerHTML = this.postalCode;
        qs("#name").innerHTML = `Welcome${(this.lastVisit!==undefined)?" back":""}, ${this.fullName}`;
        if (this.lastVisit !== undefined)
            qs("#visit").innerHTML = "Your last visit was " + this.lastVisit;

        if (_incrementMoney) //Display an animation of the money incrementing
        {
            let ms = 30;
            let moneyInterv = setInterval(()=>
            {
                let moneyDisplayed = parseInt(qs("#userMoney").innerHTML.substring(1));
                if (moneyDisplayed === this.money)
                    clearInterval(moneyInterv);
                else
                {
                    qs("#userMoney").style.setProperty("transform", "translate(0px, -1px)");
                    qs("#userMoney").innerHTML = `$${moneyDisplayed += Math.sign(this.money - moneyDisplayed)}`;

                    setTimeout(()=>qs("#userMoney").style.setProperty("transform", "translate(0px, 0.5px)"), ms);
                }
            }, ms + 10);
            qs("#userMoney").style.removeProperty("transform");
        }
        else
        {
            qs("#userMoney").innerHTML = "$" + this.money;
        }
    };
    this.updateMoney = function(__money = this.player.money, _add = false)
    {
        this.money = __money + (_add? this.money: 0);
        if (this.money < 0)
            this.money = 0;
        localStorage.setItem("money", this.money);
        this.displayInHeader(true);
    };
    this.displayInHeader();
};

let Table = function() //Where the cards are put down
{
    /*The use of previousRound prevents a reoccuring bug that if unplayedDeck is empty and each player has a 2
      each player will always play a 2 since the 2's that are placed into the deck are put back into played deck
      where the next player draws from (Because they were forced to pick up 2 cards), thus creating an infinite
      game of computers playing 2's.
    */
    this.previousRound = [];
    this.sortAutomatically = true; //Determines whether players' hands are sorted automatically.
    this.gameOver = false;
    this.playedDeck = new CardDeck(false); //Where players will PLACE their cards
    this.unplayedDeck = new CardDeck(); //Where players will TAKE cards from
    this.bet = null; //Amount of money each point is worth at the end of the game
    this.players = []; //Array containing players
    this.currentPlayerIndex = 0; // Refers to the index of the current turn's player
    this.getCurrentPlayer = function()
    {
        return this.players[this.currentPlayerIndex];
    };
    this.addPlayer = function(_player)
    {
        this.players.push(_player);
    };
    this.currentCard = null;
    this.allCards = function()
    {
        let cards = [];
        for (let plr of this.players)
            cards = cards.concat(plr.hand.cards);
        cards = cards.concat(this.unplayedDeck.cards.concat(this.playedDeck.cards));
        return cards;
    };
    this.getCardByTitle = function(_title)
    {
        let cardObj = {};
        let cardTitles = [];
        new CardDeck().cards.forEach(item => cardTitles.push(item.title)); //Add every title to cardTitles
        if (cardTitles.includes(_title)) //Ensure that input is valid
        {
            if (this.unplayedDeck.getCardByTitle(_title) !== undefined)
            {
                cardObj.src = this.unplayedDeck;
                cardObj.card = this.unplayedDeck.getCardByTitle(_title);
            }
            else if (this.playedDeck.getCardByTitle(_title) !== undefined)
            {
                cardObj.src = this.playedDeck;
                cardObj.card = this.playedDeck.getCardByTitle(_title);
            }
            else
            {
                for (let plr of this.players)
                {
                    if (plr.hand.getCardByTitle(_title) !== undefined)
                    {
                        cardObj.src = plr.hand;
                        cardObj.card = plr.hand.getCardByTitle(_title);
                    }
                }
            }
        }
        return cardObj;
    };
    this.stockCheckUnplayed = function() //Assure that unplayedDeck has enough cards to keep supplying players
    {
        if (this.unplayedDeck.cards.length <= 2) //2 is the max amount of cards a player can pick up in a turn
        {
            trackers.uDeckFill++;
            //If there are no more cards to pick up from the unplayedDeck, remove every card from the
            //playedDeck except the previously played one and place it into the unplayedDeck, face down.
            this.unplayedDeck.cards = this.unplayedDeck.cards.concat(this.playedDeck.cards.splice(0, this.playedDeck.cards.length-1)); //Move cards
            this.unplayedDeck.cards.forEach(_card => _card.faceUp = false); //face down
            this.unplayedDeck.shuffle(); //Shuffle for extra randomness
            console.log("The unplayed deck ran out of cards, so cards were moved from the played deck to the unplayed deck.");
        }
    };
    this.getNextPlayerIndex = function()
    {
        return (this.currentPlayerIndex === this.players.length - 1)? 0: this.currentPlayerIndex + 1;
    };
    this.nextTurn = function()
    {
        this.previousRound[this.currentPlayerIndex] = this.currentCard;
        this.currentPlayerIndex = this.getNextPlayerIndex();
    };
    this.gameWon = function(_plr)
    {
        this.gameOver = true;
        let totalWinnings = 0;
        console.log("Game Over!");
        for (let i = 0; i < this.players.length; i++)
        {
            if (this.players[i] !== _plr)
            {
                let pts = this.players[i].tallyPoints();
                console.log(`${this.players[i].name} ended with ${pts} points and therefore lost $${pts * this.bet}.`); //Display points
                this.players[i].lose(pts * this.bet);
                totalWinnings += pts * this.bet; //Each point is worth whatever the user set the bet to be
            }
        }
        console.log(_plr.name + " won the game and earned $" + totalWinnings + "!");
        _plr.win(totalWinnings);
        GameGUI.createGameOver(_plr, totalWinnings);
        USER.updateMoney(); //Sync the user's money with player
    };
    this.prepareGame = function(_opponents = 1, _bet = 10, _cards = 8)
    {
        //Add players
        USER.player = new Player(USER.username, USER.money, this, "user");
        this.addPlayer(USER.player);
        this.bet = _bet;
        if (_cards > 25) //Maximum 25 cards (25 in 2 players' hands, 1 in unplayed deck, 1 in played deck)
            _cards = 25;
        if (_cards < 1) //Ensures that there's at least 1 card
            _cards = 1;
        if (_opponents < 1) //Ensures that there's at least 1 opponent
            _opponents = 1;
        //Only 52 cards in 1 deck, we need to reserve >=2 for the played and unplayed decks, so max players = 50/#plrs
        if (_cards > Math.floor(50/(_opponents + 1))) //+1 to include user
            _cards = Math.floor(50/(_opponents + 1));
        for (let i = 0; i < _opponents; i++)
            this.addPlayer(new Player("CPU" + (i + 1), 5000, this));
        this.unplayedDeck.shuffle(); //Shuffle cards before dealing
        for (let i = 0; i < _cards; i++)
            for (let plr of this.players)
                plr.pickUp(); //Deal cards
        //Organize hands
        for (let plr of this.players)
            plr.hand.reorderByKind();
        this.playedDeck.cards.push(this.unplayedDeck.cards.splice(0, 1)[0]);
        this.currentCard = this.playedDeck.cards[0];
        this.currentCard.faceUp = true; //First card is faceUp
        console.log(`The first card is the ${this.currentCard.title}!`);
    };
    /**
     * Allows testers to give a specific card to a player to test a certain situation
     * _plr: Reference to player to give the card to
     * _getcard: Title of card to give the player
     * _giveCard: Title of the card the player will exchange for _getCard
     * _reorder: Whether the altered decks will be reordered
     */
    this.givePlayerCard = function(_plr, _getCard, _giveCard = _plr.hand.cards[0].title, _reorder = true)
    {
        let cardWanted;
        let cardTitles = [];
        new CardDeck().cards.forEach(item => cardTitles.push(item.title)); //Add every title to cardTitles
        if (cardTitles.includes(_getCard)) //Ensure that input is valid
        {
            if (_plr.hand.getCardByTitle(_giveCard) !== undefined)
            {
                if (_plr.hand.getCardByTitle(_getCard) === undefined) //Makes sure _plr doesn't already have _getCard
                {
                    let sourceDeck;
                    let inPlayer = false; //Flags if the source of the card was a player
                    let i = -1;
                    while (++i < this.players.length && cardWanted === undefined)
                    {
                        if (this.players[i].hand.getCardByTitle(_getCard) !== undefined)
                        {
                            cardWanted = this.players[i].hand.getCardByTitle(_getCard);
                            sourceDeck = this.players[i].hand;
                            inPlayer = true;
                        }
                    }
                    if (cardWanted === undefined) //If cardWanted was not found
                    {
                        if (this.unplayedDeck.getCardByTitle(_getCard) !== undefined) //Look in unplayedDeck
                        {
                            cardWanted = this.unplayedDeck.getCardByTitle(_getCard);
                            sourceDeck = this.unplayedDeck;
                        }
                    }
                    if (cardWanted === undefined) //Still not found...
                    {
                        if (this.playedDeck.getCardByTitle(_getCard) !== undefined) //Look in playedDeck
                        {
                            cardWanted = this.playedDeck.getCardByTitle(_getCard);
                            sourceDeck = this.playedDeck;
                        }
                    }
                    if (cardWanted === undefined)
                    {
                        console.log(`The ${_getCard} somehow does not exist.`);
                    }
                    else
                    {
                        let removedCard = _plr.hand.removeCardByTitle(_giveCard);
                        sourceDeck.removeCardByTitle(cardWanted.title);
                        _plr.hand.cards.push(cardWanted);
                        sourceDeck.cards.push(removedCard);
                        if (_reorder)
                        {
                            _plr.hand.reorderBySuit();
                            if (inPlayer) //Don't want to reorder one of the table decks
                            {
                                sourceDeck.reorderBySuit();
                            }
                        }
                    }
                }
                else
                {
                    console.log(`${_plr.name} already has the ${_getCard}.`);
                }
            }
            else
            {
                console.log(`${_plr.name} does not have the ${_giveCard}.`);
            }
        }
        else
        {
            console.log("Invalid input for _getCard in Table.givePlayerCard");
        }
        return cardWanted;
    };
};

/** This object handles everything to do with the user interface */
const GameGUI =
{
    listenersAttached: false,
    selectedCard: undefined,
    changePseudoSuit: function(_suit, _card)
    {
        if (_suit !== "cancel")
        {
            if (SUITS.indexOf(_suit) !== -1)
                _card.pseudoSuit = _suit;
            else if (_suit === "autoChoose")
                TABLE.getCurrentPlayer().autoChoosePseudoSuit(_card);
            TABLE.getCurrentPlayer().continueGame(TABLE.getCurrentPlayer().playCard(_card));
        }
        else
        {
            console.log(`${USER.player.name} chose to not play the 8`);
            GameGUI.selectedCard = undefined;
        }
    },
    chooseSuit: function(_el)
    {
        let el = (_el instanceof Event)? _el.target: _el;
        if (el.className === "separator")
            el = el.parentNode.parentNode.parentNode;
        else if (el.nodeName === "LI")
            el = el.parentNode.parentNode;
        else if (el.nodeName === "UL" || el.nodeName === "SPAN")
            el = el.parentNode;

        if ([...el.classList].includes("choice"))
        {
            GameGUI.togglePopUp("close");
            if (el.getAttribute("title") !== "cancel")
            {
                GameGUI.changePseudoSuit(el.getAttribute("title"), TABLE.getCurrentPlayer().hand.getCardByTitle(GameGUI.selectedCard));
                let playedEight = TABLE.getCardByTitle(qs(".selectedCard").title).card;
                let suitIsPseudo = playedEight.suit === playedEight.pseudoSuit;

                CardAnimations.moveCardTo(qs(".selectedCard"), qs("#currentCard"), true, suitIsPseudo);
                if (!suitIsPseudo) //Prevent flip over if the eight stays the same suit
                    setTimeout(() => {
                        CardAnimations.flipOver(qs(".selectedCard"), false, true, false);
                        setTimeout(() => {
                            CardAnimations.flipOver(qs(".selectedCard"), true, true, true);

                        }, CardAnimations.flipOver.time * 3);
                    }, CardAnimations.moveCardTo.time);
            }
            else
            {
                $(".selectedCard").removeClass("selectedCard");
                GameGUI.selectedCard = undefined;
            }
        }
    },
    selectCardByElement: function(_el)
    {
        let el = (_el instanceof Event)? _el.target: _el;
        if ([...el.classList].includes("selectableCard"))
        {
            if (GameGUI.selectedCard === el.getAttribute("title"))
            {
                GameGUI.selectedCard = undefined;
                el.classList.remove("selectedCard");
            }
            else
            {
                $(".selectedCard").removeClass("selectedCard");
                GameGUI.selectedCard = el.getAttribute("title");
                el.classList.add("selectedCard");
                if (USER.player.hand.getCardByTitle(GameGUI.selectedCard).rank === 8)
                {
                    console.log(`${USER.player.name} is choosing a new suit for their card...`);
                    GameGUI.togglePopUp(8);
                }
            }
        }
        return GameGUI.selectedCard;
    },
    rematch: function(_time = 2000)
    {
        if (typeof _time !== "number")
            _time = 2000;

        GameGUI.togglePopUp("close");
        //Close/hide game info
        qs("#gameDiv").style.removeProperty("display");
        $("#playerDisplay, #cpuNames, #cpuCards").html("");
        setTimeout(()=>
        {
            //Close/hide win screen
            $("#gameResult, #plrPoints > ul, #winner").html("");
        }, _time);
        //Bring up form to prompt player to enter new info
        qs("#gameForm").style.removeProperty("display");
    },
    cardsAreFlipped: false, //Used to indicate whether cards are flipped
    attachListeners: function(_force = GameGUI.listenersAttached) //If need be, force listeners to be added (again)
    {
        if (!_force) //Prevent adding 2 of the same listeners by calling this twice
        {
            qs("#cardDisplayDiv").addEventListener("mousedown", GameGUI.selectCardByElement, true);
            qs("#eightChoice").addEventListener("click", GameGUI.chooseSuit, true);
            qs("#rematchBtn").addEventListener("click", GameGUI.rematch);
            window.addEventListener("keydown", function(e)
            {
                if (e.keyCode === 13 && !TABLE.gameOver) //ENTER: Continue game
                {
                    GameGUI.continueBtnClicked();
                }
                else if (e.keyCode === 69 && !TABLE.gameOver) //e: Autoplay
                {
                    USER.player.type = "cpu";
                    TABLE.getCurrentPlayer().automatedPlay();
                    GameGUI.updateCardDisplay();
                    USER.player.type = "user";
                }
                else if (e.keyCode === 81) //q: Show Eight Choice pop up
                {
                    GameGUI.togglePopUp(8);
                }
                else if (e.keyCode === 87) //w: Show game over pop up
                {
                    GameGUI.togglePopUp("gameOver");
                }
                else if (e.keyCode === 82) //r: Toggle sortAutomatically
                {
                    TABLE.sortAutomatically = !TABLE.sortAutomatically;
                    console.log("The player's hand will " + (TABLE.sortAutomatically?"":"not ") + "sort itself automatically.");
                }
                else if (e.keyCode === 70) //f: Flip everyone's card
                {
                    let turnedCards = [];
                    for (let plr of TABLE.players)
                        if (plr !== USER.player) //Every player's hand except the user's (Need to remain face up)
                            turnedCards = turnedCards.concat(plr.hand.cards);
                    turnedCards = turnedCards.concat(TABLE.unplayedDeck.cards); //Add unplayed deck (Will eventually have graphics)
                    turnedCards.forEach(card=>card.faceUp = !GameGUI.cardsAreFlipped);
                    GameGUI.cardsAreFlipped = !GameGUI.cardsAreFlipped;
                    GameGUI.updateCardDisplay();
                }
                else if (e.keyCode === 84) //t: Toggle visibility of tracking div
                {
                    let $track = $("#tracking");
                    if ($track.css("display") === "none")
                        $track.css("display", "block");
                    else
                        $track.css("display", "");
                }
                else if (e.keyCode === 37 || e.keyCode === 39) //<- or ->
                {
                    GameGUI.togglePopUp("close"); //In case selected was 8
                    if (TABLE.getCurrentPlayer() === USER.player)
                    {
                        console.log(e.keyCode);
                        let userHand = [...qsAll("#" + USER.username + "_cards > .selectableCard")];
                        let selectedIndex = userHand.indexOf(qs(".selectableCard[title='" + GameGUI.selectedCard +"'"));
                        if (e.keyCode === 37) //<-
                        {
                            if (selectedIndex <= 0)
                                selectedIndex = userHand.length;
                            else
                                selectedIndex = userHand.indexOf(qs(".selectableCard[title='" + GameGUI.selectedCard +"'"));
                            GameGUI.selectCardByElement(userHand[--selectedIndex]);
                        }
                        else if (e.keyCode === 39) //->
                        {
                            if (selectedIndex >= userHand.length - 1)
                                selectedIndex = -1;
                            else
                                selectedIndex = userHand.indexOf(qs(".selectableCard[title='" + GameGUI.selectedCard + "'"));
                            GameGUI.selectCardByElement(userHand[++selectedIndex]);
                        }
                    }
                }
            });
            qs("#currentCard").addEventListener("click", ()=>
            {
                if (!TABLE.gameOver)
                    GameGUI.continueBtnClicked();
            });
            qs("#unplayedReal").addEventListener("click", ()=>
            {
                if (!TABLE.gameOver) //Option to force pickup (Ignore selectedCard)
                    GameGUI.continueBtnClicked();
                    // GameGUI.continueBtnClicked(TABLE.getCurrentPlayer(), "undefined"); //In case I want to reimplement
            });
            GameGUI.listenersAttached = true;
        }
    },
    continueBtnClicked: function(_update = true)
    {
        let plr = TABLE.getCurrentPlayer();
        if (GameGUI.selectedCard === "undefined")
            GameGUI.selectedCard = undefined;
        let playedCard;
        if (plr.type === "user")
        {
            playedCard = plr.playCard(GameGUI.selectedCard);
            plr.continueGame(playedCard);
            if (playedCard !== undefined && typeof(playedCard) !== "string")
            {
                CardAnimations.moveCardTo(qs(".selectedCard"), qs("#currentCard"), false, true);
            }
            else //If player chooses not to play
            {
                if (GameGUI.selectedCard === undefined)
                {
                    CardAnimations.flipOver(qs("#unplayedReal"));
                    setTimeout(() => {
                        CardAnimations.moveCardTo(qs("#unplayedReal"), plr, false, true);
                    }, CardAnimations.flipOver.time * 2);
                }
                else
                {
                    if (_update)
                        GameGUI.updateCardDisplay();
                }
            }
            GameGUI.selectedCard = undefined;
        }
        else
        {
            playedCard = plr.automatedPlay();
            if (playedCard !== undefined)
            {
                let cardEl = qs(`.gameCard[title='${playedCard.title}']`);
                CardAnimations.flipOver(cardEl, false);
                setTimeout(()=>
                {
                    let suitIsPseudo = playedCard.suit === playedCard.pseudoSuit;
                    let is8 = playedCard.rank === 8;
                    CardAnimations.moveCardTo(cardEl, qs("#currentCard"), is8, !is8 || suitIsPseudo);
                    if (is8)
                    {
                        setTimeout(()=>
                        {
                            CardAnimations.flipOver(cardEl, false, true, false);
                            setTimeout(()=>
                            {
                                CardAnimations.flipOver(cardEl, true, true, true);
                            }, CardAnimations.flipOver.time*3);
                        }, CardAnimations.moveCardTo.time);
                    }
                }, CardAnimations.flipOver.time*2);
            }
            else
            {
                CardAnimations.moveCardTo(qs("#unplayedReal"), plr, false, true);
            }
        }
        if (playedCard !== undefined)
            return playedCard.constructor === Card;
        else
            return false;
    },
    updateCardImgs: function()
    {
        console.log("Update Cards");
        [...qsAll(".gameCard")].forEach(gameCard=>
            gameCard.setAttribute("src", TABLE.getCardByTitle(gameCard.title).card.getImg())
        );
    },
    updateCardDisplay: function()
    {
        updateTrackers();
        $(".currentPlayer").removeClass("currentPlayer");
        for (let plr of TABLE.players) //For every player
        {
            let cardDiv = qs(`#${plr.name}_cards`);
            cardDiv.innerHTML = ""; //Remove previous turn's info
            if (plr === TABLE.getCurrentPlayer()) //Highlight current player's name
            {
                if (plr !== USER.player)
                    GameGUI.changeVisibleCard(qs(`#${plr.name}_name`));
                qs(`#${plr.name}_name`).classList.add("currentPlayer");
            }
            for (let card of plr.hand.cards)
            {
                //Add card images
                let img = document.createElement("img");
                img.classList.add("gameCard");
                img.setAttribute("src", card.getImg(false));
                img.setAttribute("title", card.title);
                img.setAttribute("alt", (plr === USER.player)?card.title:`${plr.name}'s card`);
                if (plr === USER.player) //Only user player's cards are selectable
                {
                    if (TABLE.getCurrentPlayer() === USER.player) //Only when it's their turn
                        img.classList.add("selectableCard");
                }
                else
                {
                    img.classList.add("cpuCard");
                }
                cardDiv.appendChild(img);
            }
        }
        $(".selectableCard").draggable({
            scroll: false,
            containment: "#gameDiv",
            revert: "invalid"
        });
        $("#currentCard").droppable({
            accept: ".selectableCard:not([title*='Eight'])",
            drop: function(ev, ui)
            {
                $(".selectedCard").removeClass("selectedCard");
                ui.draggable.addClass("selectedCard");
                GameGUI.selectedCard = ui.draggable.get(0).title;
                if (!TABLE.gameOver)
                    if (!GameGUI.continueBtnClicked(false)) //If card was not played
                        $(".selectableCard").draggable("option", "revert", true);
                    else
                        $(".selectableCard").draggable("option", "revert", "invalid");
            }
        });
        qs("#currentCard").setAttribute("src", TABLE.currentCard.getImg());
        qs("#unplayedReal").setAttribute("src", TABLE.unplayedDeck.cards[0].getImg());

        qs("#currentCard").setAttribute("title", TABLE.currentCard.title);
        qs("#unplayedReal").setAttribute("title", TABLE.unplayedDeck.cards[0].title);
    },
    /** This function changes which CPU's cards are visible */
    changeVisibleCard: function(_el)
    {
        let el = (_el instanceof Event)? _el.target: _el;
        if (el !== null)
            if (el.classList.contains("cpuPlr"))
            {
                $(".visibleCPU").removeClass("visibleCPU"); //Remove previous visible cards
                $(`#${el.for}, #${el.id}`).addClass("visibleCPU");
            }
    },
    createGameOver: function(_winner, _winnings)
    {
        qs("#gameResult").innerHTML = `${(_winner === USER.player)? "YOU": _winner.name} WON!`;
        let resList = qs("#plrPoints > ul");
        for (let plr of TABLE.players)
        {
            if (plr !== _winner)
            {
                let plrInfo = document.createElement("li");
                plrInfo.innerHTML = `${(plr === USER.player)? "You": plr.name} ended with
                ${plr.tallyPoints()} points and therefore lost $${plr.tallyPoints() * TABLE.bet}.`;
                resList.append(document.createElement("hr"));
                resList.append(plrInfo);
            }
        }
        qs("#winner").innerHTML = `${(_winner === USER.player)? "You": _winner.name} won the game and earned
        $${_winnings}!`;

        GameGUI.togglePopUp("gameOver");
    },
    togglePopUp: function(_div)
    {
        let $popUp = $("#popUpContainer");
        if ($popUp.css("display") === "none" && _div !== "close")
        {
            $popUp.slideDown("2000");
            if (_div === 8)
            {
                $("#eightChoice").css("display", "flex");
                $popUp.css("outline-color", "black");
                for (let suit of SUITS) //List player's cards of given suit
                {
                    let $suitList = $(`.choice[title='${suit}'] > .suitList`); //.choice element with specified SUITS name
                    let cardsInSuit = TABLE.getCurrentPlayer().hand.getCardsOfSuit(suit, -8); //Exclude 8's
                    $suitList.html(cardsInSuit.map(
                        (card, ind, arr)=>
                            `<li>${card.name}${(ind === arr.length - 1)? "":
                                "<span class='separator'>, </span>"}</li>` //Append comma except for last card
                    ).join(""));
                }
            }
            else if (_div === "gameOver")
            {
                $("#gameOver").css("display", "block");
                $popUp.css("outline-color", "white");
            }
        }
        else
        {
            $popUp.slideUp("2000", ()=>
                $($popUp.children().css("display", ""))
            );
        }
    }
};

let CardAnimations = {

    /**
     * @param _el: The element (Most likely a card image) that will translate over to _to
     * @param _to: The element that _el travels to. If a Player object is passed,
     * the destination becomes that player's last card
     * @param _remain: Whether the element will have it's transform property removed (And therefore sent back to original position)
     * @param _update: Whether updateCardDisplay will be called after the animation
     */
    moveCardTo: function(_el, _to = qs("#currentCard"), _remain = true, _update = false)
    {
        let el = (_el instanceof Event)? _el.target: _el;

        let elR = el.getBoundingClientRect();
        let to, xLen, yLen;
        if (_to instanceof Player)
        {
            to = qs(`#${_to.name}_cards`).lastChild;
            xLen = to.x - elR.x + ((to.width - elR.width) / 2);
            yLen = to.y - elR.y + ((to.height - elR.height) / 2);
        }
        else //Assume it's a DOM element
        {
            to = _to.getBoundingClientRect();
            xLen = to.x - elR.x + ((to.width - elR.width) / 2);
            yLen = to.y - elR.y + ((to.height - elR.height) / 2);
        }

        //Make sure that moving element is above destination element
        if (parseInt($(el).css("z-index")) <= parseInt($(el).css("z-index"))
            && _to instanceof Player)
        //Check that _to is a player because only then is 'to' an element (And therefore have style property)
            el.style.setProperty("z-index", parseInt(to.style.getPropertyValue("z-index")) + 1);

        el.style.setProperty("transition", `transform ${this.moveCardTo.time}ms ease 0s`);
        el.style.setProperty("transform", `translate(${xLen}px,${yLen}px) scale(${to.width/elR.width}, ${to.height/elR.height})`);
        setTimeout(()=>
        {
            if (_update)
                GameGUI.updateCardDisplay();
            if (!_remain)
            {
                el.style.removeProperty("z-index");
                el.style.removeProperty("transition");
                el.style.removeProperty("transform");
            }
        }, this.moveCardTo.time);
    },
    /**
     * @param _el: Card element to flip over
     * @param _pseudo: Whether or not the card will represent it's pseudo suit or it's actual rank
     * @param _flip: Whether to flip the card object. Default false because this is most likely already taken care of
     * @param _update: Whether updateCardDisplay will be called after the animation
     */
    flipOver: function(_el, _pseudo = true, _flip = false, _update = false)
    {
        let ms = this.flipOver.time;
        let el = (_el instanceof Event)? _el.target: _el;
        if ([...el.classList].includes("gameCard"))
        {
            el.style.setProperty("transition", `transform ${this.flipOver.time}ms linear`);
            let transformB = el.style.getPropertyValue("transform"); //Store the current value of transform Before flipping
            el.style.transform += `rotateY(90deg)`;
            setTimeout(() => {
                let targetCard = TABLE.getCardByTitle(el.title).card;
                if (_flip)
                    targetCard.flip();
                el.src = targetCard.getImg(_pseudo);//`${(el.src === path + "images/cards/backRed.png")? targetCard.getImg(_pseudo): "images/cards/backRed.png"}`;

                el.style.setProperty("transform", transformB);
                setTimeout(()=>
                {
                    if (_update)
                        GameGUI.updateCardDisplay();
                }, ms);
            }, ms);
        }
    }
};
CardAnimations.moveCardTo.time = 1000;
CardAnimations.flipOver.time = 300;