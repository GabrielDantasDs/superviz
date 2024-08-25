export default class CardActivity {
    readonly source_position: number;
    readonly destination_position: number;
    readonly id_card: number;
    readonly id_user: number;
    readonly id_sprint: number;
    readonly source_list_id: number;
    readonly destination_list_id: number;

    constructor(source_position:number, destination_position:number, id_card:number, id_user:number, id_sprint:number, source_list_id:number, destination_list_id:number) {
        this.source_position = source_position;
        this.destination_position = destination_position;
        this.id_card = id_card;
        this.id_user = id_user;
        this.id_sprint = id_sprint;
        this.source_list_id = source_list_id;
        this.destination_list_id = destination_list_id;
    }
}