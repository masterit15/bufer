<template>
  <div id="home">
    <b-container fluid>
      <b-row>
        <b-col cols="3" class="p-0">
          <app-sidebar v-on:content="getDepartamentFolder"></app-sidebar>
        </b-col>
        <b-col cols="9" class="p-0">
          <div class="content">
            <app-header></app-header>
            <b-table hover :items="dirContent" :fields="fields">
              <template #cell(name)="data">
                <div
                  class="rows"
                  @click="showContextMenu = false"
                  @contextmenu.prevent="
                    contextMenu($event, data.item.name, data.item.index)
                  "
                >
                 <span class="obj-icon" v-html="icon(data.item)"></span> {{ data.item.name }}
                </div>
              </template>
              <template #cell(createDateTime)="data">
                <div
                  class="rows"
                  @click="showContextMenu = false"
                  @contextmenu.prevent="
                    contextMenu($event, data.item, data.item.index)
                  "
                >
                  {{ data.item.createDateTime }}
                </div>
              </template>
              <template #cell(changeDateTime)="data">
                <div
                  class="rows"
                  @click="showContextMenu = false"
                  @contextmenu.prevent="
                    contextMenu($event, data.item, data.item.index)
                  "
                >
                  {{ data.item.changeDateTime }}
                </div>
              </template>
              <template #cell(size)="data">
                <div
                  class="rows"
                  @click="showContextMenu = false"
                  @contextmenu.prevent="
                    contextMenu($event, data.item, data.item.index)
                  "
                >
                  {{ data.item.size != '0' ? data.item.size : '' }}
                </div>
              </template>
            </b-table>
            <context-menu
              :display="showContextMenu"
              ref="menu"
              :position="style"
            >
              <ul>
                <li @click.prevent="contextItemClick('notice')">
                  <i class="fa fa-bell"></i> Уведомить
                </li>
                <li @click.prevent="contextItemClick('rename')">
                  <i class="fa fa-pencil"></i> Переименовать
                </li>
                <li @click.prevent="contextItemClick('delete')">
                  <i class="fa fa-trash"></i> Удалить
                </li>
              </ul>
            </context-menu>
            <div class="addcontent" v-show="showDargDrop">
              <DragDroup/>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AppSidebar from "@/layout/Sidebar";
import AppHeader from "@/layout/Header";
import ContextMenu from "@/components/ContextMenu";
import DragDroup from "@/components/DragDroupUploader";
import smalltalk from 'smalltalk'
function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}
export default {
  name: "home",
  data() {
    return {
      dirContent: [],
      dirPath: "",
      contextActiveItem: null,
      showContextMenu: false,
      showDargDrop: false,
      activeRow: '',
      style: {
        top: "",
        left: "",
      },
      fields: [
        {
          key: "name",
          label: "Имя файла",
          sortable: true,
        },
        {
          key: "createDateTime",
          label: "Дата создания",
          sortable: true,
        },
        {
          key: "changeDateTime",
          label: "Дата изменения",
          sortable: true,

        },
        {
          key: "size",
          label: "Размер",
          sortable: true,
          // Variant applies to the whole column, including the header and footer
          // variant: 'success'
        },
      ],
    };
  },
  methods: {
    contextMenu(event, data, index) {
      console.log(data)
      this.activeRow = ''
      this.activeRow = data
      this.style.top = event.clientY;
      this.style.left = event.clientX;
      this.outsideClick(event.target);
      this.showContextMenu = true;
    },
    outsideClick(elem) {
      let that = this;
      function outsideClickListener(event) {
        if (!elem.contains(event.target) && isVisible(elem)) {
          that.showContextMenu = false;
          document.removeEventListener("click", outsideClickListener);
        }
      }
      document.addEventListener("click", outsideClickListener);
      function isVisible(elem) {
        //открыто ли условное окно
        return (
          !!elem &&
          !!(
            elem.offsetWidth ||
            elem.offsetHeight ||
            elem.getClientRects().length
          )
        );
      }
    },
    contextItemClick(option) {
      
      let filePath = this.$path.resolve(this.dirPath) + "/" + this.activeRow;
      if (option == "notice") {
        console.log("notice");
      } else if (option == "rename") {
        let fileName = this.activeRow.split(".");
        let fileExt = this.activeRow.split(".").pop();
        smalltalk
          .prompt(
            "Переивеновать",
            "Введите новое имя файла",
            `${fileName[0]}`,
            {
              buttons: {
                ok: "Переименовать",
                cancel: "Отмена",
              },
            }
          )
          .then((newFileName) => {
            if (newFileName != this.activeRow) {
              this.$fs.rename(
                filePath,
                this.$path.resolve(this.dirPath) +
                  "/" +
                  newFileName +
                  "." +
                  fileExt,
                () => {
                  // this.$message(
                  //   `Файл ${this.activeRow} успешно переименован в ${
                  //     newFileName + "." + fileExt
                  //   }`,
                  //   "",
                  //   "success"
                  // );
                  makeToast(
                      `Файл ${this.activeRow} успешно переименован в ${
                      newFileName + "." + fileExt
                    }`,
                    "success"
                    )
                  this.getDirContent(this.$path.resolve(this.dirPath));
                }
              );
            }
          })
          .catch(() => {
            console.log("cancel");
          });
      } else if (option == "delete") {
        smalltalk
          .confirm(
            "Удаление",
            `Вы действительно хотите удалить файл '${this.activeRow}'?`,
            {
              buttons: {
                ok: "Удалить",
                cancel: "Отмена",
              },
            }
          )
          .then(() => {
            this.$fs.unlink(filePath, (err) => {
              if (err) throw err;
              makeToast(`Файл '${this.activeRow}' успешно удален!`, text, "success")
              this.getDirContent(this.$path.resolve(this.dirPath));
            });
          })
          .catch(() => {
            console.log("no");
          });
      }
    },
    makeToast(title, text, variant = null) {
        this.$bvToast.toast(text, {
          title: title,
          variant: variant,
          solid: true
        })
    },
    icon(obj){
      let icon = ''
      let color = ''
      let ext = obj.name.split('.').pop()
      if(obj.size == '0'){
        icon = `<i class="fa fa-folder-o" style="color: #fed330;"></i>`
      }else{
        switch (ext.toLowerCase()) {
          case 'jpeg':
          case 'jpg':
          case 'png':
          case 'tif':
          case 'gif':
            icon = `<i class="fa fa-file-image-o" style="color: #2bcbba;"></i>`
            break;
          case 'mp4':
          case 'avi':
          case 'wmv':
          case 'flv':
          case 'vob':
            icon = `<i class="fa fa-file-video-o" style="color: #2bcbba;"></i>`
            break;
          case 'mp3':
            icon = `<i class="fa fa-file-audio-o" style="color: #8854d0;"></i>`
            break;
          case 'pdf':
            icon = `<i class="fa fa-file-pdf-o" style="color: #fc5c65;"></i>`
            break;
          case 'zip':
          case 'rar':
          case '7zip':
            icon = `<i class="fa fa-file-archive-o" style="color: #fc5c65;"></i>`
            break;
          case 'xls':
          case 'xlsx':
          case 'csv':
            icon = `<i class="fa fa-file-excel-o" style="color: #20bf6b;"></i>`
            break;
          case 'doc':
          case 'rtf':
          case 'docx':
            icon = `<i class="fa fa-file-word-o" style="color: #3867d6;"></i>`
            break;
          case 'txt':
            icon = `<i class="fa fa-file-text" style="color: #a5b1c2;"></i>`
            break;
          default:
            icon = `<i class="fa fa-file" style="color: #4b6584;"></i>`
            break;
        }
        
      }
      return icon
    },
    getDepartamentFolder(departament){
      this.showDargDrop = true
    }
  },
  components: {
    AppSidebar,
    AppHeader,
    ContextMenu,
    DragDroup
  },
};
</script>