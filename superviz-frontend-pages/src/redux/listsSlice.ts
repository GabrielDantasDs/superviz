import { reorderCards } from "@/api/lists";
import { Card, List } from "@/interfaces/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { current, original } from 'immer';

const getInitialState = (): List[] => {
  let initialId = '';
  let initialName = '';
  let initialLists = [];

  if (typeof window !== 'undefined') {
    let project_lists = localStorage.getItem('lists');

    if ( project_lists !== null) {
      initialLists = JSON.parse(project_lists)
    } else {
      initialLists = [];
    }
    
  }

  return initialLists
}

const initialState: List[] = [];

interface addCardToListArg {
	id_destination_list: number | string;
  new_card_position: number;
	card: Card;
}

interface removeCardFromListArg {
	id_origin_list: number | string;
	card: Card;
}

interface RenameListArgs {
  id_list: number | string;
  title: string
}

const listsSlice = createSlice({
	name: "lists",
	initialState: getInitialState,
	reducers: {
		setLists: (state, action: PayloadAction<List[]>) => {
			return action.payload;
		},
		addCardToList: (state, action: PayloadAction<addCardToListArg>) => {
			// O que eu retornar aqui é o novo estado, então retornar a lista com o novo card
			let card = action.payload.card;
      let new_card_position = action.payload.new_card_position;
      const list = state.find((list) => list.id == action.payload.id_destination_list);

			if (list) {
				let cards = list.cards;
        // A posição do card tem que mudar antes de ele entrar na lista --> PRIORIDADE, RESOLVER ANTES DE TUDO
        card = {...card, position: new_card_position};
				// Caso vá pro fim da lista
				if (cards.length - 1 == card.position) {

					cards.push(card);

					list.cards = cards;
				} 

        //Caso vá pro começo da lista
        else if (cards.length == 0) {
					cards.push(card);

					list.cards = cards;
				}

        //Caso seja novo
        else if (card.position == 0) {
          cards = cards.map((item) => {
            return { ...item, position: item.position + 1 };
          });

          cards.unshift(card);

          list.cards = cards;
        }

				//Se tiver um card naquela posição
        else {
          cards = cards.map((item) => {
            if (item.position > card.position) {
              return { ...item, position: item.position + 1 };
            }
  
            return item;
          });

          cards.splice(card.position, 0, card);

          list.cards = cards;

          localStorage.setItem('lists', JSON.stringify(state));
        }
			}
		},
		removeCardFromList: (state, action: PayloadAction<removeCardFromListArg>) => {
			let card = action.payload.card;
      const list = state.find((list) => list.id == action.payload.id_origin_list);

      if (list) {
        let cards = list.cards;

        cards.splice(card.position, 1);

				cards = cards.map((item) => {
					if (item.position > card.position) {
						return { ...item, position: item.position - 1 };
					}

					return item;
				});

				list.cards = cards;
        
        localStorage.setItem('lists', JSON.stringify(state));
      }
		},
    addNewList: (state, action: PayloadAction<List>) => {
      let lists = JSON.parse(JSON.stringify(state));
      let list = action.payload;
      lists.push(list);

      return lists;
    },
    renameList: (state, action: PayloadAction<RenameListArgs>) => {
      let id_list = action.payload.id_list;
      let title = action.payload.title;

      let list = state.find(list => list.id == id_list);

      if (list) {
        list.header.title = title;
        
        localStorage.setItem('lists', JSON.stringify(state));
      }
    }
	},
});

export const { setLists, addCardToList, removeCardFromList, addNewList, renameList } = listsSlice.actions;
export default listsSlice.reducer;
