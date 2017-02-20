import { Component, Renderer, ViewChild } from '@angular/core';
import { NavController, Searchbar } from 'ionic-angular';

import { CollegeDetailPage } from '../college-detail/college-detail';

import { Colleges } from '../../providers/colleges';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  @ViewChild(Searchbar) searchEl: Searchbar;

  public college_control = "all";
  public college_gender = "all";
  public college_type = "all";
  public college_degree = "all";
  public showResults = false;
  public test_optional = false;
  public liberal_arts = false;
  public states: string[] = [];
  public majors: string[] = [];

  public filteredColleges = [];

  constructor(
    public navCtrl: NavController,
    public collegeService: Colleges,
    public renderer: Renderer
  ) {

  }

  ionViewDidLoad() {
    this.collegeService.getLocalCollegeData();
  }


  getColleges(searchbar) {

    let query:any = this.searchEl.value;

    if (searchbar && query.length < 3) {
      this.showResults = false;
      this.filteredColleges = [];
      return;
    }

    this.filteredColleges = this.collegeService.allData.filter((v) => {
      this.showResults = true;

      if (
          // query/searchbar in college name
          v.instnm.toLowerCase().indexOf(query.toLowerCase()) > -1 &&
          // filters by state if states are checked
          (this.states.length == 0 || this.states.indexOf(v.state)) > -1 &&
          // filters by degree
          (this.college_degree == 'all' || this.college_degree == v.preddeg) &&
          // filters by control (public / private)
          (this.college_control == 'all' || this.college_control == v.control) &&
          // filter by gender
          (this.college_gender == 'all' || v[this.college_gender] == 1) &&
          // filter by cultural_type
          (this.college_type == 'all' || v[this.college_type] == 1) &&
          // filter by liberal_arts
          (!this.liberal_arts || v.liberal_arts) &&
          // filter by test_optional
          (!this.test_optional || v.test_optional)


      ) {
        if (this.majors.length > 0) {
          let hasMajors = true;
          for (var i = 0; i < this.majors.length; i++) {
            let major = this.majors[i].toLowerCase();
            if (!v[major]) hasMajors = false;
          }
          if (hasMajors) return true;
          else return false;
        }
        return true;
      }
      return false;

    });

    this.filteredColleges.sort(function compare(a,b) {
      if (a.grad_rate < b.grad_rate)
        return 1;
      if (a.grad_rate > b.grad_rate)
        return -1;
      return 0;
    });

    this.filteredColleges = this.filteredColleges.slice(0,99);
  }

  clearResults() {
    this.searchEl.value = '';
    this.filteredColleges = [];

    this.showResults = false;
  }

  goToCollege(id) {
    this.collegeService.getCollege(id)
    .then(collegeData => {
      this.navCtrl.push(CollegeDetailPage, {
        collegeData: collegeData
      });
    });
  }

  public majorsList = [
    ["PCIP01", "Agriculture, Agriculture Operations, and Related Sciences"],
    ["PCIP03", "Natural Resources and Conservation"],
    ["PCIP04", "Architecture and Related Services"],
    ["PCIP05", "Area, Ethnic, Cultural, Gender, and Group Studies"],
    ["PCIP09", "Communication, Journalism, and Related Programs"],
    ["PCIP10", "Communications Technologies/Technicians and Support Services"],
    ["PCIP11", "Computer and Information Sciences and Support Services"],
    ["PCIP12", "Personal and Culinary Services"],
    ["PCIP13", "Education"],
    ["PCIP14", "Engineering"],
    ["PCIP15", "Engineering Technologies and Engineering-Related Fields"],
    ["PCIP16", "Foreign Languages, Literatures, and Linguistics"],
    ["PCIP19", "Family and Consumer Sciences/Human Sciences"],
    ["PCIP22", "Legal Professions and Studies"],
    ["PCIP23", "English Language and Literature/Letters"],
    ["PCIP24", "Liberal Arts and Sciences, General Studies and Humanities"],
    ["PCIP25", "Library Science"],
    ["PCIP26", "Biological and Biomedical Sciences"],
    ["PCIP27", "Mathematics and Statistics"],
    ["PCIP29", "Military Technologies and Applied Sciences"],
    ["PCIP30", "Multi/Interdisciplinary Studies"],
    ["PCIP31", "Parks, Recreation, Leisure, and Fitness Studies"],
    ["PCIP38", "Philosophy and Religious Studies"],
    ["PCIP39", "Theology and Religious Vocations"],
    ["PCIP40", "Physical Sciences"],
    ["PCIP41", "Science Technologies/Technicians"],
    ["PCIP42", "Psychology"],
    ["PCIP43", "Homeland Security, Law Enforcement, Firefighting and Related Protective Services"],
    ["PCIP44", "Public Administration and Social Service Professions"],
    ["PCIP45", "Social Sciences"],
    ["PCIP46", "Construction Trades"],
    ["PCIP47", "Mechanic and Repair Technologies/Technicians"],
    ["PCIP48", "Precision Production"],
    ["PCIP49", "Transportation and Materials Moving"],
    ["PCIP50", "Visual and Performing Arts"],
    ["PCIP51", "Health Professions and Related Programs"],
    ["PCIP52", "Business, Management, Marketing, and Related Support Services"],
    ["PCIP54", "History"],
  ];




}
