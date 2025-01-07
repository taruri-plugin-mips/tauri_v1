export function desktop(comment: string, name: string) {
  return `[Desktop Entry]
  Categories=
  Comment=${comment}
  Exec=${name}
  Icon=usr/share/icons/hicolor/256x256@2/apps/${name}.png
  Name=${name}
  Terminal=false
  Type=Application
`
}
