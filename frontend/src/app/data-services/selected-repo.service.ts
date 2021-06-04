import { Injectable } from '@angular/core';

import {Repo} from './../models/repo.model';

@Injectable({
    providedIn: 'root'
})
export class SelectedRepoService {
    private _selectedRepo: Repo =null;
 
    setRepo(selectedRepo: Repo) {
        this._selectedRepo = selectedRepo;
    }
 
    getRepo(): Repo {
        return this._selectedRepo;
    }
}