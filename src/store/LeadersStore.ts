import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import ApiService from "../services/ApiService";
import { LeaderDto } from "../common/dto/LeaderDto";

enableStaticRendering(typeof window === 'undefined');

class LeadersStore {
    loading = false;
    leaders: LeaderDto[] = [];

    constructor() {
        makeAutoObservable(this, undefined, { autoBind: true });
    }

    async getLeaders() {
        this.loading = true;

        try {
            this.leaders = await ApiService.getLeaders();
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }
}

export default new LeadersStore();