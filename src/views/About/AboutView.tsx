import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Renders "About" view
 * url: /about
 */
const AboutView = () => {
  const { t } = useTranslation();
  return (
    <Stack sx={{ padding: '20px 20px', overflow: 'auto' }}>
      <h2>Herausgeber:</h2>
      aula gGmbH
      <br />
      Alte Schönhauser Straße 23/24
      <br />
      10119 Berlin
      <br />
      Fon: 030-28040850
      <br />
      E-Mail: info@aula.de
      <p>
        Die aula gGmbH ist beim Amtsregister Charlottenburg unter der Nummer 244593 B registriert. Vertreten durch:
        Alexa Schaegner (Geschäftsführung), Steffen Wenzel (Geschäftsführung)
      </p>
      <p>
        <h2>Inhaltlich verantwortlich gemäß § 55 Absatz 2 RStV:</h2>
      </p>
      <p>Steffen Wenzel (Anschrift siehe oben)</p>
      <p>
        <h2>Datenschutzbeauftragter:</h2>
      </p>
      <p>Daniel Knoll</p>
      <p>
        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
        Gesetzen verantwortlich. Nach § 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
        übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
        rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen
        nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
        Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
        Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
      </p>
      <p>
        <h2>Nutzungsbedingungen:</h2>
      </p>
      Texte, Bilder, Grafiken sowie die Gestaltung dieser Internetseiten unterliegen dem Urheberrecht. Sie dürfen von
      Ihnen nur zum privaten und sonstigen eigenen Gebrauch im Rahmen des § 53 Urheberrechtsgesetz (UrhG) verwendet
      werden. Eine Vervielfältigung oder Verwendung dieser Seiten oder Teilen davon in anderen elektronischen oder
      gedruckten Publikationen und deren Veröffentlichung ist nur mit unserer Einwilligung gestattet. Diese erteilen auf
      Anfrage, die für den Inhalt Verantwortlichen. Weiterhin können Texte, Bilder, Grafiken und sonstige Dateien ganz
      oder teilweise dem Urheberrecht Dritter unterliegen. Auch über das Bestehen möglicher Rechte Dritter geben Ihnen
      die für den Inhalt Verantwortlichen nähere Auskünfte. Der Nachdruck und die Auswertung von Pressemitteilungen und
      Reden sind mit Quellenangabe allgemein gestattet.
      <p>
        <h2>Haftungsausschluss:</h2>
      </p>
      <p>
        Alle auf dieser Internetseite bereitgestellten Informationen haben wir nach bestem Wissen und Gewissen
        erarbeitet und geprüft. Eine Gewähr für die Aktualität, Richtigkeit, Vollständigkeit und Verfügbarkeit der
        bereit gestellten Informationen können wir allerdings nicht übernehmen. Ein Vertragsverhältnis mit den Nutzern
        des Internetangebots kommt nicht zustande. Wir haften nicht für Schäden, die durch die Nutzung dieses
        Internetangebots entstehen. Dieser Haftungsausschluss gilt nicht, soweit die Vorschriften des § 839 BGB (Haftung
        bei Amtspflichtverletzung) einschlägig sind. Für etwaige Schäden, die beim Aufrufen oder Herunterladen von Daten
        durch Schadsoftware oder der Installation oder Nutzung von Software verursacht werden, wird nicht gehaftet.
      </p>
      <p>
        <h2>Links:</h2>
      </p>
      Von unseren eigenen Inhalten sind Querverweise („Links“) auf die Webseiten anderer Anbieter zu unterscheiden.
      Durch diese Links ermöglichen wir lediglich den Zugang zur Nutzung fremder Inhalte nach § 8 Telemediengesetz. Bei
      der erstmaligen Verknüpfung mit diesen Internetangeboten haben wir diese fremden Inhalte daraufhin überprüft, ob
      durch sie eine mögliche zivilrechtliche oder strafrechtliche Verantwortlichkeit ausgelöst wird. Wir können diese
      fremden Inhalte aber nicht ständig auf Veränderungen überprüfen und daher auch keine Verantwortung dafür
      übernehmen. Für illegale, fehlerhafte oder unvollständige Inhalte und insbesondere für Schäden, die aus der
      Nutzung oder Nichtnutzung von Informationen Dritter entstehen, haftet allein der jeweilige Anbieter der Seite.
    </Stack>
  );
};

export default AboutView;
